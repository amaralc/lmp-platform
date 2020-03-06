/* --------------------------------- IMPORTS ---------------------------------*/
import User from '../models/User';
import File from '../models/File';
/* --------------------------------- CONTENT ---------------------------------*/
class ProviderController {
  async index(req, res) {
    /** O User.findAll retornaria todos os usuários cadastrados, entretando... */
    const providers = await User.findAll({
      /** ... ao utilizarmos o WHERE, nos é retornado apenas os usuários cujo provider consta true. */
      where: { provider: true },
      /** ATTRIBUTES serve para retornar apenas os dados que desejamos, caso contrário, retornaria os dados de todas as colunas da tabela. */
      attributes: ['id', 'name', 'email', 'avatar_id'],
      /** Para retornar todos os dados do avatar do usuários, utilizamos o INCLUDE */
      include: [
        {
          model: File,
          /** Utilizando o AS, podemos alterar o nome que será retornado, ao invés de retornar File, retornará avatar. */
          as: 'avatar',
          /** Para retornar apenas o que precisamos, utilizamos ATTRIBUTES novamente para retornar apenas o name e path do File. */
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}
/* --------------------------------- EXPORTS ---------------------------------*/
export default new ProviderController();
