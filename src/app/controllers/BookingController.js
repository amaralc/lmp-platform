/* --------------------------------- IMPORTS ---------------------------------*/
/** Importa tudo de yup como Yup (dependencia nao tem export default) */
import * as Yup from 'yup';
/** Importa alguns métodos da biblioteca date-fns */
import { startOfHour, parseISO, isBefore, subHours } from 'date-fns';
import Booking from '../models/Booking';
import Equipment from '../models/Equipment';
/* --------------------------------- CONTENT ---------------------------------*/
class BookingController {
  /**
   * Metodo index com mesma face de um middleware no node.
   * Coleta registro de equipmentos dentro da base de dados expõe ao usuário.
   */
  async index(req, res) {
    /**
     * O Booking.findAll retorna todos os agendamentos cadastrados de um
     * determinado usuário
     */
    const booking = await Booking.findAll({
      where: { user_id: req.userId, canceled_at: null },
      /** Os agendamentos são ordenados por horário e data */
      order: ['date'],
      include: {
        model: Equipment,
        /** 'attributes' filtra os dados que serão mostrados ao usuário */
        attributes: [
          'category',
          'equipment_name',
          'company',
          'model',
          'color',
          'serial_number',
          'comments',
          'state',
          'room_id',
          'image',
        ],
      },
    });
    return res.json(booking);
  }

  /**
   * Metodo store com mesma face de um middleware no node.
   * Recebe dados do agendamento e cria novo registro dentro da base de dados.
   */
  async store(req, res) {
    /** Define schema to validate req.body prior to 'store()' data */
    const schema = Yup.object().shape({
      /** Attribute 'equipment_id' is a required number */
      equipment_id: Yup.number().required(),
      /**
       * Attribute 'date' is a required date,
       * ex: "year-month-dayT14:00:00-03:00"
       */
      date: Yup.date().required(),
    });
    /** If 'req.body' do not attend to the schema requirements (is not valid) */
    if (!(await schema.isValid(req.body))) {
      /** Return error status 400 with message 'Validation has failed' */
      return res.status(400).json({ error: 'Validation has failed' });
    }

    /** Busca equipment_id e date de dentro do req.body */
    const { equipment_id, date } = req.body;
    /**
     * Método startOfHour pega apenas o valor de hora e
     * zera valores de minutos ou segundos.
     * Método parseISO converte string que será digitada em um objeto
     * date do javascript.
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * Verifica se a data que o usuário preencheu é passada em relação a
     * data atual
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permit' });
    }
    /**
     * Verifica se já não há um agendamento de determinado equipamento em uma
     * determinada data
     */
    const checkAvailability = await Booking.findOne({
      where: {
        equipment_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    /** Se o agendamento existir, retorna erro */
    if (checkAvailability) {
      return res.status(400).json({ error: 'Booking date is not permit' });
    }

    /**
     * Cria agendamento na base de dados usando resposta asincrona e retorna apenas
     * dados uteis.
     */

    const booking = await Booking.create({
      user_id: req.userId,
      equipment_id,
      date,
    });

    return res.json(booking);
  }

  /**
   * Metodo delete com mesma face de um middleware no node.
   * Permite com que o usuário delete registro dentro da base de dados.
   */
  async delete(req, res) {
    const booking = await Booking.findByPk(req.params.id);
    /**
     * Se o usuário que for deletar o agendamento não for o usuário que
     * fez o agendamento, retorna erro.
     */
    if (booking.user_id !== req.userId) {
      return res.statur(401).json({
        error: "You don't have permission to cancel this booking",
      });
    }
    /**
     * Define variável que remove duas horas do horário do agendamento
     * para prazo de cancelamento
     */
    const dateWithSub = subHours(booking.date, 2);
    /**
     * Checa se o horário marcado para agendamento está a pelo menos duas
     * horas da hora em que o usuário marcou, se não está, retorna erro
     */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel booking 2 hours in advance',
      });
    }
    /** Data de cancelamento */
    booking.canceled_at = new Date();

    await booking.save();

    return res.json(booking);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/

export default new BookingController();
