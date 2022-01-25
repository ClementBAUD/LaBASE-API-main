const { sequelize } = require("../db/sequelize");

// liste des etudiant sur l'app 
const NombreEtudiant = (idprofile) => {
    const sql = ` 
    SELECT count(*) as nbre
    FROM 
    user_magasins  usM
    inner join magasins mg on mg.id =usM.magasinId
    inner join users usrs on  usrs.id= usM.userId
    inner join statutcompts sta on  sta.id= usrs.statutcomptId
    where 
    usrs.profilId=${idprofile}
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des etudiant sur l'app dont le statut est en attente de valider 
const NombreEtudiantStatut = (idprofile,statutcommande) => {
    const sql = ` 
    SELECT count(*) as nbre
    FROM 
    user_magasins  usM
    inner join magasins mg on mg.id =usM.magasinId
    inner join users usrs on  usrs.id= usM.userId
    inner join statutcompts sta on  sta.id= usrs.statutcomptId
    where 
    usrs.ProfilId=${idprofile}
    AND sta.id=${statutcommande}
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

const NombreCommande = () => {
    const sql = ` 
    SELECT 
	COUNT(DISTINCT cmd.NumCom) as nbre 
    FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

const NombreCommandeNoRecup = (statutcom) => {
    const sql = ` 
    SELECT 
	COUNT(DISTINCT cmd.NumCom) as nbre 
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId    
WHERE
     stu.id=${statutcom}
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

//nombre de produit p
const nbreComProduit = (statutcom) => {
    const sql = ` 
    SELECT 
	SUM(lgcom.quantite) as nbre 
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
WHERE
      stu.id=${statutcom}
      
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// nombre de commande des 30 dernier jours 
const nbreComDernierJours = (statutcom) => {
    const sql = ` 
    SELECT
	count(*) as nobreCommande,
    DATE_FORMAT( cmd.createdAt, "%Y-%m-%d") dCreat
FROM 
	commandes cmd
	INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
WHERE
/*	createdAt BETWEEN DATE("2021-06-01") AND DATE("2021-06-22")*/
	cmd.createdAt > DATE_SUB(NOW(),INTERVAL 30 DAY)
	AND stu.id=${statutcom}
GROUP BY
	dCreat
ORDER BY
	dCreat ASC
      
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

const resultatSMS = (donne) => {
  
    const sql = `SELECT
	        users.tel as userTel
         FROM 
	        users
         WHERE
            users.id IN (${donne}) `

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}


const ModifyUSERS = (idprofile) => {
    const sql = `
    UPDATE users
    SET statutcompteId = '4' 
    WHERE users.id = (${idprofile})
    `
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}



module.exports = {

    NombreEtudiant,
    NombreCommandeNoRecup,
    NombreCommande,
    nbreComProduit,
    nbreComDernierJours,
    NombreEtudiantStatut,
    resultatSMS,
    ModifyUSERS


}