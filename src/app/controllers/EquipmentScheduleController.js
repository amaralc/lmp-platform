/** Importa alguns métodos da biblioteca date-fns */
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Booking from '../models/Booking';

class EquipmentScheduleController {
  /**
   * Metodo index com mesma face de um middleware no node.
   * Coleta registro de agendamentos dentro da base de dados expõe ao usuário.
   */
  async index(req, res) {
    /** Desestrutura variaveis 'date' e 'equipment_id' de dentro da  */
    const { date, equipment_id } = req.query;
    /**
     * Método parseISO converte string que será digitada em um objeto
     * date do javascript.
     */
    const parsedDate = parseISO(date);
    /** O Booking.findAll retorna todos os agendamentos cadastrados */
    const bookings = await Booking.findAll({
      where: {
        equipment_id,
        canceled_at: null,
        date: {
          /**
           *  Sistema retorna todos os agendamentos, entre o primeiro e
           *  o último horário, da data preenchida em 'value'
           */
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },

      /** Os agendamentos são ordenados por horário e data */
      order: ['date'],
    });
    /** Retorna json apenas com dados uteis ao frontend */
    return res.json(bookings);
  }
}

export default new EquipmentScheduleController();
