const { sequelize } = require("../db/sequelize");

const Recup = (users, routi, protocol) => {
    const sql = ` SELECT COUNT(*) as res
    FROM profil_roles 
    left outer join roles on roles.id = profil_roles.roleId
    left outer join users_profils on users_profils.profilId = profil_roles.roleId
    WHERE
        users_profils.UserId =  ${users}
        AND roles.protocol = ${protocol}
        AND  roles.route=${routi}
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// Liste des administrateurs actifs
const listeUsersAdmin = () => {
    const sql = ` SELECT users.id,users.nom,users.prenom,users.email,users.tel,users.adresse
    FROM 
    users
    where users.ProfilId=1
    AND users.statutcomptId=1
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des users par magasin
const listeUserMAg = (idmagasin, idprofile) => {
    const sql = ` SELECT users.id,users.nom,users.prenom,users.email,usM.magasinId,users.tel,users.adresse
    FROM 
    user_magasins  usM
    inner join magasins mg on mg.id =usM.magasinId
    inner join users on  users.id= usM.userId
    where mg.id=${idmagasin}
    AND users.ProfilId=${idprofile}
    AND users.statutcomptId=2
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des users sur l'app 
const listeUserAll = (idprofile) => {

        const sql = ` 
        SELECT 
             usM.magasinId,mg.nom as nomMag, usrs.id as userId, usrs.nom as nomUser,usrs.prenom ,usrs.email,usrs.certi_scolarite,usrs.tel,sta.nom as nomStatut
        FROM 
            user_magasins  usM
            inner join magasins mg on mg.id =usM.magasinId
            inner join users usrs on  usrs.id= usM.userId
            inner join statutcompts sta on  sta.id= usrs.statutcomptId
    where usrs.profilId=${idprofile}
`

        return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}
    // liste des produit dispo du jour par magasin
const listeProduitMAg = (idmagasin) => {
    const sql = `SELECT 
    mad.id as id_prodDispo, pr.image, 
    mad.libelle, mad.quantiteActuel,mad.quantiteInit,
    mad.description,
    pr.ingredient,
    pr.allergene,
    pr.valeurNutritionnelle,
    mag.id as id_mag, mag.nom
        FROM 
            produits pr
            INNER JOIN miseadispos mad ON pr.id = mad.produitId
            INNER JOIN magasins mag ON mag.id = mad.magasinId
        WHERE
            mag.id = ${idmagasin}
            AND mad.quantiteActuel > 0
            AND mad.createdAt > CURRENT_DATE
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// filtre la liste des produits mise a dispo par mag 
const FiltrelisteProduitMAgDonne = (idmagasin, datefiltreDebut, datefiltreFin) => {

    const sql = `SELECT  
        distinct  SUM(mad.quantiteInit) as quantitedonne,
        pr.plu,
        pr.ingredient,
        pr.allergene,
        pr.valeurNutritionnelle,
        mad.id as id_prodDispo, pr.image, 
        mad.libelle, mad.quantiteInit,
        stDisp.nom as statutdisponibilite,
        mag.nom as magasin
        FROM 
            produits pr       
            INNER JOIN miseadispos mad ON pr.id = mad.produitId
            INNER JOIN magasins mag ON mag.id = mad.magasinId
            INNER JOIN statusdispos stDisp ON stDisp.id = mad.statusdispoId
        WHERE
            mag.id =  ${idmagasin}
            AND mad.date BETWEEN '${datefiltreDebut}' AND '${datefiltreFin}'
        Group by 
            pr.plu 
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste de tous les produits donnés depuis et leur quantité par mag 
const listeProduitMAgDonne = (idmagasin) => {
    const sql = `
    SELECT  
        distinct  SUM(mad.quantiteInit) as quantitedonne,
        pr.plu,
        mad.id as id_prodDispo, pr.image, 
        mad.libelle, mad.quantiteInit,
        stDisp.nom as statutdisponibilite,
        mag.nom as magasin
        FROM 
            produits pr
            INNER JOIN miseadispos mad ON pr.id = mad.produitId
            INNER JOIN magasins mag ON mag.id = mad.magasinId
            INNER JOIN statusdispos stDisp ON stDisp.id = mad.statusdispoId
        WHERE
            mag.id =  ${idmagasin}
        Group by 
            pr.plu 
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste de tous les produits donnés depuis et leur quantité 
const listeProduitDonne = (idmagasin,idstatut) => {
    const sql = `SELECT  
    distinct  SUM(lgcom.quantite)  as quantitedonne,
    pr.plu,pr.titre,
    msad.id as id_prodDispo, pr.image, 
    msad.quantiteInit
    FROM 
            commandes cmd
            INNER JOIN statutcommandes stu ON cmd.statutcommandeId = stu.id
            INNER JOIN lignecommandes lgcom ON lgcom.commandeId = cmd.id
            INNER JOIN miseadispos msad ON msad.id = lgcom.miseadispoId
            INNER JOIN produits pr ON pr.id = msad.produitId
            INNER JOIN magasins mag ON mag.id = msad.magasinId
	WHERE
    	cmd.statutcommandeId= ${idstatut}
        AND mag.id= ${idmagasin}
        AND msad.createdAt > CURRENT_DATE	
    Group by 
        pr.plu,pr.titre,pr.image, msad.quantiteInit, id_prodDispo
        `

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

/*Liste des catégories ayant au moins un produit*/
const listeCategorieDuJour = (idmagasin) => {
    const sql = `
    SELECT
    distinct fam.id, fam.nom
FROM
    familles fam
    INNER JOIN produits pr ON pr.familleId = fam.id
    INNER JOIN miseadispos mad ON pr.id = mad.produitId
    INNER JOIN magasins mag ON mag.id = mad.magasinId
WHERE
    mag.id = ${idmagasin}
    AND mad.quantiteActuel > 0
    AND mad.createdAt > CURRENT_DATE	
ORDER BY
	fam.nom
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

const listeUserProfil = (idprofile) => {
    const sql = `
    SELECT usrs.id, usrs.nom, usrs.email
    FROM 
    users  usrs
    inner join statutcompts sta on  sta.id= usrs.statutcomptId
    where usrs.profilId= ${idprofile} 
    `

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// liste des produit dispo du jour par magasin
const listeProduitMAgjour = (idmagasin, idfamille) => {
    const sql = `SELECT 
            mad.id as id_prodDispo, pr.image, 
            mad.libelle, mad.quantiteActuel,
            stDisp.nom as statutprod,
            pr.ingredient,
            pr.allergene,
            pr.valeurNutritionnelle,
            mag.id as id_mag, mag.nom
        FROM 
        produits pr
            INNER JOIN miseadispos mad ON pr.id = mad.produitId
            INNER JOIN magasins mag ON mag.id = mad.magasinId
            INNER JOIN statusdispos stDisp ON stDisp.id = mad.statusdispoId
            INNER JOIN familles fam ON fam.id=pr.familleId
        WHERE
            mag.id = ${idmagasin}
            AND fam.id=${idfamille}
            AND mad.quantiteActuel > 0
            AND mad.date > CURRENT_DATE
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// Detail User
const DetailUser = (iduser) => {
    const sql = ` 
    SELECT usM.magasinId,mg.nom as nomMag, usrs.id as userId, usrs.nom as nomUser,usrs.prenom ,usrs.email,usrs.certi_scolarite,usrs.tel,sta.nom as nomStatut,usrs.dateExp
    FROM 
    user_magasins  usM
    inner join magasins mg on mg.id =usM.magasinId
    inner join users usrs on  usrs.id= usM.userId
    inner join statutcompts sta on  sta.id= usrs.statutcomptId
    where usrs.id=${iduser}  
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// Detail des produit dispo du jour par magasin
const DetailProduitMAg = (idproduit) => {
    const sql = `SELECT 
                mad.id as id_prodDispo, pr.image, 
                mad.libelle, mad.quantiteActuel,
                pr.ingredient,
                pr.allergene,
                pr.valeurNutritionnelle,
                mag.id as id_mag,
                mad.description
            FROM 
                produits pr
                INNER JOIN miseadispos mad ON pr.id = mad.produitId
                INNER JOIN magasins mag ON mag.id = mad.magasinId
            WHERE
            mad.id = ${idproduit}
               
    `

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

//liste produits d'une categories 
const CategoriesListeProduits = (idmagasin,idfamille) => {
    const sql = `SELECT 
    mad.id as id_prodDispo, pr.image, 
    mad.libelle, mad.quantiteActuel,mad.quantiteInit,
    mad.description,
    pr.ingredient,
    pr.allergene,
    fa.nom as nom_famille,
    pr.valeurNutritionnelle,
    mag.id as id_mag, mag.nom
        FROM 
            produits pr
            INNER JOIN miseadispos mad ON pr.id = mad.produitId
            INNER JOIN familles fa On fa.id =pr.familleId
            INNER JOIN magasins mag ON mag.id = mad.magasinId
        WHERE
            mag.id = ${idmagasin}
            AND mad.quantiteActuel > 0
            AND mad.createdAt > CURRENT_DATE
            AND pr.familleId=${idfamille}
`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// 
const autreFnt =(tabIdUser) => {
  
    const sql = `SELECT
	        users.tel as userTel
         FROM 
	        users
         WHERE
            users.id IN (${tabIdUser}) `

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

// ID Magasin de l'utilisateur (0 si non trouvé)
const nbMagasinUser =(tabIdUser) => {
  
    const sql = `SELECT COUNT(*) AS nb FROM user_magasins WHERE userId=${tabIdUser}`

    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}

module.exports = {
    Recup,
    listeUserMAg,
    listeProduitMAg,
    FiltrelisteProduitMAgDonne,
    listeProduitMAgDonne,
    listeProduitDonne,
    listeUserAll,
    listeCategorieDuJour,
    listeProduitMAgjour,
    listeUserProfil,
    DetailProduitMAg,
    CategoriesListeProduits,
    DetailUser,
    autreFnt,
    nbMagasinUser,
    listeUsersAdmin
}