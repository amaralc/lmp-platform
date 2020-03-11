/* --------------------------------- IMPORTS ---------------------------------*/
import mongoose from 'mongoose';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Cria novo schema usando o mongoose orm (equivalente ao sequelize para postgres)
 */
const NotificationSchema = new mongoose.Schema(
  {
    /** Conteudo da notificaçao */
    content: {
      type: String,
      required: true,
    },
    /** Usuário que irá receber a notificação */
    user: {
      type: Number,
      required: true,
    },
    /** Atributo que verifica se notificação foi lida ou não */
    read: {
      type: Boolean,
      required: true,
      /** Define como padrão que a notificação não foi lida */
      default: false,
    },
  },
  {
    /** Adiciona created_at e updated_at */
    timestamps: true,
  }
);

/* --------------------------------- EXPORTS ---------------------------------*/
/** Exporta model Notification passando schema como segundo parâmetro */
export default mongoose.model('Notification', NotificationSchema);
