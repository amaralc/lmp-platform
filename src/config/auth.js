/* --------------------------------- EXPORTS ---------------------------------*/
export default {
  /** String secreta aleatoria (ex.: gerada no md5online.org) */
  secret: process.env.APP_SECRET,
  /** Envia data de expiracao obrigatoria do token (padrao: 7 dias) */
  expiresIn: '7d',
};
