const { sequelize } = require("../db/sequelize");


// liste des commande du jour par magasin
const ListeCommandeMagJour = (idmagasin) => {
    const sql = ` 
    SELECT 
        cmd.id,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom ,usr.tel, stu.id as id_statut,stu.nom as nom_statut,
        mag.id as id_mag,mag.nom as nom_mag,cmd.heureRecuperation
    FROM
        commandes cmd
        INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
        INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
        INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
        INNER JOIN magasins mag ON mag.id = msad.magasinId
        INNER JOIN users usr ON usr.id = cmd.userId
        
    WHERE
        cmd.createdAt > CURDATE()
        AND mag.id=${idmagasin}
    GROUP BY
        cmd.id
    ORDER By 
        cmd.createdAt DESC
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des commande passer par magasin
const ListeCommandeMagLast = (idmagasin) => {
        const sql = ` 
    SELECT 
        cmd.id,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom, stu.id as id_statut,stu.nom as nom_statut,
        mag.id as id_mag,mag.nom as nom_mag,cmd.createdAt as date_commande
    FROM
        commandes cmd
        INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
        INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
        INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
        INNER JOIN magasins mag ON mag.id = msad.magasinId
        INNER JOIN users usr ON usr.id = cmd.userId
        
    WHERE
        cmd.createdAt < CURDATE()
        AND mag.id=${idmagasin}
    GROUP BY
        cmd.id
    ORDER By 
        cmd.createdAt DESC
`

        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }
    // liste des commande passer par magasin
const ListeCommandeUserLast = (iduser) => {
    const sql = ` 
    SELECT 
       DISTINCT( cmd.id) as id_com,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom, stu.id as id_statut,stu.nom as nom_statut,
        mag.id as id_mag,mag.nom as nom_mag,cmd.createdAt as date_commande
    FROM
        commandes cmd
        INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
        INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
        INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
        INNER JOIN magasins mag ON mag.id = msad.magasinId
        INNER JOIN users usr ON usr.id = cmd.userId
        
    WHERE
        cmd.createdAt < CURDATE()
        AND usr.id=${iduser}
    ORDER By 
        cmd.createdAt DESC
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}


// liste des commande Filtre par statut par magasin
const ListeCommandeFiltreStatutMag = (idmagasin, idStatut) => {

    const sql = `
    SELECT 
	cmd.id,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom, stu.id as id_statut,stu.nom as nom_statut
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
      
WHERE
     cmd.createdAt > CURDATE()
     AND mag.id=${idmagasin}
     AND stu.id=${idStatut}
GROUP BY
	cmd.id
ORDER By 
	cmd.id DESC

`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

const ListeCommandeStatutMag = (idmagasin, idStatut) => {

    const sql = `
    SELECT 
	cmd.id,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom,usr.tel,
     stu.id as id_statut,stu.nom as nom_statut,cmd.createdAt,cmd.createdAt,
     cmd.heureRecuperation
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
      
WHERE
     mag.id=${idmagasin}
     AND stu.id=${idStatut}
     AND cmd.createdAt > CURDATE()
GROUP BY
	cmd.id
ORDER By 
	cmd.id DESC

`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

const ListeCommandeStatutUser = (iduser, idStatut) => {

    const sql = `
    SELECT 
	cmd.id,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom,usr.tel,
     stu.id as id_statut,stu.nom as nom_statut,cmd.createdAt,
     cmd.heureRecuperation
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
      
WHERE
    usr.id=${iduser}
     AND stu.id=${idStatut}
GROUP BY
	cmd.id
ORDER By 
	cmd.id DESC

`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des commande Filtre par statut et date par magasin
const ListeCommandeFiltrstatutDATEeMag = (idmagasin, idStatut, datedebut, datefin) => {

    const sql = `
    SELECT 
	cmd.id,cmd.NumCom,usr.id as id_usr ,usr.email ,usr.nom ,usr.prenom, stu.id as id_statut,stu.nom as nom_statut
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
      
WHERE
     cmd.createdAt BETWEEN '${datedebut}' AND '${datefin}'
     AND mag.id=${idmagasin}
     AND stu.id=${idStatut}
  
GROUP BY
	cmd.id
ORDER By 
	cmd.id DESC
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des commande par user
const ListeCommandeJourUser = (idUser) => {
    const sql = ` SELECT 
	usr.id as users_id,usr.email,cmd.id as id_commande,cmd.NumCom,
    cmd.heureRecuperation,cmd.createdAt as date_commande,mag.id as id_mag, 
    mag.nom as nom_mag,stu.id as statut_command,stu.nom as nom_statut_com
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
WHERE
    cmd.UserId=${idUser}
    AND cmd.createdAt > CURDATE()
GROUP by 
	cmd.NumCom
ORDER By 
    cmd.id DESC

`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des commande Filtre  par user
const ListeCommandeUser = (idUser, idStatut) => {
    const sql = ` 
    SELECT 
	usr.id as users_id,usr.email,cmd.id as id_commande,cmd.NumCom,
    cmd.heureRecuperation,cmd.createdAt as date_commande,mag.id as id_mag, 
    mag.nom as nom_mag,stu.id as statut_command,stu.nom as nom_statut_com
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
WHERE
    cmd.UserId=${idUser} AND
    stu.id=${idStatut}
GROUP by 
	cmd.NumCom
ORDER By 
    cmd.id DESC
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// Detail commande user 
const detailcommande = (idcom, idmagasin) => {
    let num = idcom;
    const sql = ` 
    SELECT 
    cmd.id,cmd.NumCom,usr.id as id_usr ,mag.id as id_mag ,
    msad.id as id_misadispo, msad.libelle,pr.image,lgcom.quantite,
    cmd.createdAt as date_commande,
    pr.plu ,msad.description
FROM commandes cmd
	  INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      INNER JOIN users usr ON usr.id = cmd.userId
      INNER JOIN produits pr ON pr.id =msad.produitId
WHERE
cmd.id=${num}
    AND mag.id=${idmagasin}
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

//Nombre étudiant par magasin
const nbreEtudiant = (idmagasin,profil,statut) => {
        const sql = ` 
    SELECT count(*) as nbEtu
    FROM 
    user_magasins  usM
    inner join magasins mg on mg.id =usM.magasinId
    inner join users on  users.id= usM.userId
    where mg.id=${idmagasin}
    And users.profilId=${profil}
    And users.statutcomptId=${statut}
`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }
    //nombre de commande par magasin 
const nbreComMag = (idmagasin) => {
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
     mag.id=${idmagasin}
`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }
    //nombre de commande par magasin non recupérée
const nbreComRecup = (idmagasin, idStatut) => {
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
     mag.id=${idmagasin}
     AND stu.id=${idStatut}
`
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }
    //nombre de produit par magasin 
const nbreComProd = (idmagasin) => {
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
     mag.id=${idmagasin}
    `
        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
    }
    //nombre de produit par magasin  par jour 
const nbreComProdDay = (idmagasin,statut) => {
    const sql = ` 
    SELECT 
	coalesce(SUM(lgcom.quantite),0) as nbre 
FROM
	commandes cmd
      INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
      INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
      INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
      INNER JOIN magasins mag ON mag.id = msad.magasinId
      
WHERE
     mag.id=${idmagasin} 
     AND stu.id=${statut}
     AND cmd.createdAt > CURDATE()
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// nombre de commande par jour et par magasin
const nbreComMagDay = (idmagasin) => {
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
     mag.id=${idmagasin}
     AND cmd.createdAt > CURDATE()
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

//nombre de commande par magasin non recupérée et par jour 
const nbreComRecupDay = (idmagasin, idStatut) => {
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
            mag.id=${idmagasin}
            AND stu.id=${idStatut}
            AND cmd.createdAt > CURDATE()
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

//nombre de commande par magasin pas encore valider et par jour 
const nbreComNovalidpDay = (idmagasin, idStatut) => {
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
            mag.id=${idmagasin}
            AND stu.id=${idStatut}
            AND cmd.createdAt > CURDATE()
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// nobre de commande du jour pour un y=user
const nbreComDayByUSer = (iduser) => {
    const sql = ` 
    SELECT 
    COUNT(cmd.id) as nbreCommande,
       usr.id as users_id,usr.email,cmd.id as id_commande,cmd.NumCom   
    FROM
         commandes cmd
         INNER JOIN users usr ON usr.id = cmd.userId
    WHERE
       cmd.userId=${iduser}
       AND cmd.createdAt > CURDATE()
    
   GROUP By
       cmd.id 
`
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

//
module.exports = {
    ListeCommandeMagJour,
    ListeCommandeFiltreStatutMag,
    ListeCommandeFiltrstatutDATEeMag,
    ListeCommandeJourUser,
    ListeCommandeUser,
    ListeCommandeMagLast,
    detailcommande,
    nbreEtudiant,
    nbreComMag,
    nbreComRecup,
    ListeCommandeStatutMag,

    nbreComProd,
    nbreComProdDay,
    nbreComMagDay,
    nbreComRecupDay,
    nbreComNovalidpDay,

    nbreComDayByUSer,
    ListeCommandeUserLast,
    ListeCommandeStatutUser
}