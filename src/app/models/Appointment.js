/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

/* --------------------------------- CONTENT ---------------------------------*/
/**
 * Cria classe Appointment extendendo os metodos da classe Model, da dependencia
 * 'sequelize'
 */
class Appointment extends Model {
  /**
   * Metodo estatico que sera chamado automaticamente pelo sequelize
   */
  static init(sequelize) {
    /**
     * Chama metodo init da classe superior (Model) enviando colunas da base
     * de dados e envia somente o que o usuario vai fornecer como input.
     * (chave primaria, etc, nao sao necessarias)
     */
    super.init(
      {
        /** Data do agendamento */
        date: Sequelize.DATE,
        /** Timestamp do cancelamento */
        canceled_at: Sequelize.DATE,
        /** Agendamentos que ja aconteceram (boolean) */
        past: {
          /** Campo que não existe no banco de dados */
          type: Sequelize.VIRTUAL,
          /** Utiliza metodo get() para retornar o valor do campo virtual */
          get() {
            return isBefore(this.date, new Date());
          },
        },
        /** Indica se campo é cancelável ou não (boolean) */
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            /**
             * Retorna true se horário atual for ao menos 2 horas anterior
             * ao horário do agendamento.
             */
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        /*
         ** Argumento que sera enviado pelo loader de models
         */
        sequelize,
      }
    );

    /** Retorna model que acaba de ser inicializado */
    return this;
  }

  /** Cria relacionamento entre models */
  static associate(models) {
    /**
     * Obs: Quando fazemos mais de um relacionamento na tabela, somos obrigados
     * a criar um "apelido" ('user_id', as 'user') para cada foreignKey para que
     * o Sequelize não se perca.
     */

    /** Relaciona coluna 'user_id'como 'user' ao model 'User' */
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

    /** Relaciona coluna 'provider_id'como 'provider' ao model 'User' */
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default Appointment;
