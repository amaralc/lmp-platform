/* --------------------------------- IMPORTS ---------------------------------*/
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

/* --------------------------------- CONTENT ---------------------------------*/
class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila executou!');

    /**
     * Envia email
     */
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      /** Retirou-se o 'text' e adiocionou-se 'template' */
      template: 'cancellation',
      /** Envia todas as variáveis que o cancellation está esperando */
      context: {
        /** Informa nome do provedor */
        provider: appointment.provider.name,
        /** Informa nome do cliente */
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new CancellationMail();
