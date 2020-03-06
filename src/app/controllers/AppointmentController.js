/* --------------------------------- IMPORTS ---------------------------------*/
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

/* --------------------------------- CONTENT ---------------------------------*/

class AppointmentController {
  async index(req, res) {
    /** Pega 'page' de req.query, a partir da página 1 por padrão */
    const { page = 1 } = req.query;
    /** A variavél appointments irá encontrar todos os registros... */
    const appointments = await Appointment.findAll({
      /**
       * ... onde 'user_id' for o ID do usuário que está "logado" na sessão
       * atual e apenas os agendamentos que não foram cancelados ainda, ou seja,
       * 'canceled_at' seja nulo.
       */
      where: { user_id: req.userId, canceled_at: null },
      /**
       * Exibirá os agendamentos em ordem cronológica, do mais antigo ao mais
       * atual
       */
      order: ['date'],
      /**
       * Utilizamos o método 'attributes' para retornar apenas os dados
       * necessários, são eles o id do appointment, data agendada e se
       * agendamento é anterior ao timestamp atual e se ainda é cancelável
       */
      attributes: ['id', 'date', 'past', 'cancelable'],
      /** Lista no máximo 20 registros */
      limit: 20,
      /** offset define quantos registros o sistema irá pular */
      offset: (page - 1) * 20,
      /** Incluirá algumas informações do prestador de serviço... */
      include: [
        {
          model: User,
          /** Como Appointment.js se relaciona com User mais de uma vez, torna-se necessário explicitar qual
           * relacionamento desejamos escolher, utilizando o método 'as'.  */
          as: 'provider',
          /** Utilizamos o método 'attributes' para retornar apenas os dados necessários,
           * são eles o id e o name do prestador. */
          attributes: ['id', 'name'],
          /** Utilizando novamente o include, podemos incluir no retorno do método GET appointments, o avatar do provedor */
          include: [
            {
              model: File,
              /** Retornará a url do arquivo, apelidado de 'avatar' */
              as: 'avatar',
              /** Informando apenas o id e a URL do arquivo. Solicitar o path é necessário para gerar o URL completo sem
               * erros, já que ele é utilizado em File.js.
               */
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados provider_id e date e cria novo registro de agendamento dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'provider_id' is a required number */
      provider_id: Yup.number().required(),
      /** Attribute 'date' is a required date with a valid date format */
      date: Yup.date().required(),
    });

    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation fails' */
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if 'provider_id' is a provider
     */

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    /** Se 'checkIsProvider' retornar false, será retornado um erro. */
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /** O método 'parseISO' irá transformar a string que recebemos em um objeto DATE do JS e este objeto pode ser
     * utilizado dentro do método 'startOfHour'. Este último método, por exemplo, caso o usuário informe algum horário
     * que não seja "o-clock", ele irá transformar este horário para o "o-clock" anterior. Ex.: 18:27:54 será
     * transformado em 18:00:00 e armazenado em 'hourStart'. */

    const hourStart = startOfHour(parseISO(date));

    /** Check for past dates,
     * Caso a data informada para agendamento for uma data anterior à data no momento do agendamento, retornará um erro. */

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /** Check date availability. */

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    /** Caso a 'date' informada para agendamento já estiver ocupada pelo 'provider_id' informado, retornará erro e não
     * efetuará o agendamento, para que não haja duplicidade. */
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    /** Cria agendamento na base de dados usando resposta asincrona e retorna a confirmação dos dados. */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /**
     * Save current user in variable 'user'
     */
    const user = await User.findByPk(req.userId);

    /**
     * Formata data do agendamento
     */
    const formattedDate = format(
      /** Data a ser formatada */
      hourStart,
      /** Formato (utilizando aspas simples para inserir texto na formatação) */
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      /** Idioma do formato (utilizado para converter MMMM no nome do mês) */
      { locale: pt }
    );

    /**
     * Notify appointment to provider
     */
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    /**
     * Cria objeto 'appointment' buscando pelo parametro 'id' no banco de dados
     */
    const appointment = await Appointment.findByPk(req.params.id, {
      /**
       * Inclui informações do prestador de serviços
       */
      include: [
        {
          model: User,
          /** Salva com nome 'provider' conforme definido no model Appointment */
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    /**
     * Impede que usuario cancele agendamento a menos que seja o dono
     */
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    /**
     * Remove 2 horas do timestamp do agendamento
     */
    const dateWithSub = subHours(appointment.date, 2);

    /**
     * Verifica se 'dateWithSub' é anterior ao horário atual e caso seja, envia
     * mensagem de erro.
     */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    /**
     * Define horario do cancelamento como o timestamp atual
     */
    appointment.canceled_at = new Date();

    /**
     * Salva appointment
     */
    await appointment.save();

    /**
     * Adiciona job de cancelamento referenciado pela chave
     */
    await Queue.add(CancellationMail.key, {
      /** Passa os dados do appointment dentro de um objeto */
      appointment,
      teste: 'teste',
    });

    return res.json(appointment);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new AppointmentController();
