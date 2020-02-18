/* --------------------------------- IMPORTS ---------------------------------*/
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

/* --------------------------------- CONTENT ---------------------------------*/

class AppointmentController {
  async index(req, res) {
    /** A variavél appointments irá encontrar todos os registros... */
    const appointments = await Appointment.findAll({
      /** ... onde 'user_id' for o ID do usuário que está "logado" na sessão atual e apenas os agendamentos que não
       * foram cancelados ainda, ou seja, 'canceled_at' seja nulo. */
      where: { user_id: req.userId, canceled_at: null },
      /** Exibirá os agendamentos em ordem cronológica, do mais antigo ao mais atual. */
      order: ['date'],
      /** Utilizamos o método 'attributes' para retornar apenas os dados necessários,
       * são eles o id do appointment e a data agendada. */
      attributes: ['id', 'date'],
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

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    /** Se 'isProvider' retornar false, será retornado um erro. */
    if (!isProvider) {
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
      date: hourStart,
    });

    return res.json(appointment);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new AppointmentController();
