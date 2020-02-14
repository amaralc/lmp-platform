/* --------------------------------- IMPORTS ---------------------------------*/
import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Room from '../app/models/Room';
import Container from '../app/models/Container';
import Tool from '../app/models/Tool';
import Equipment from '../app/models/Equipment';
import Lab from '../app/models/Lab';
import Booking from '../app/models/Booking';

/* --------------------------------- CONTENT ---------------------------------*/
/* Cria array com todos os models da aplicacao */
const models = [User, File, Room, Container, Tool, Equipment, Lab, Booking];

/*
 ** Cria classe Database
 */
class Database {
  constructor() {
    this.init();
  }

  /*
   ** metodo que faz conexao com base de dados e carrega os models da aplicacao
   */
  init() {
    /*
     ** Variavel esperada dentro dos models no metodo init
     */
    this.connection = new Sequelize(databaseConfig);

    models
      /* Acessa o metodo init de cada model da aplicacao passando a conexao */
      .map(model => {
        model.init(this.connection);
        return model;
      })

      /** Se 'model.associate' existir (condição &&) chama metodo passando models */
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new Database();
