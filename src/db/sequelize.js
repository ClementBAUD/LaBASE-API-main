const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/user.model')
const StatutComptModel = require('../models/statutCompte.model')
const RoleModel = require('../models/role.model')
const ProfilModel = require('../models/profil.model')
const ProfilRoleModel = require('../models/profil_role.model')
const UserProfilModel = require('../models/user_profil.model')
const MagasinModel = require('../models/magasin.model')
const UserMagasinModel = require('../models/user_magasin.model')
const AbonnementModel  = require('../models/abonnement.model');

    // famille et sous famille 
const FamilleModel = require('../models/famille.model')
    // produits
const ProduitModel = require('../models/produits.model')
    // mise a dispo des produits
const MiseADispoModel = require('../models/MiseADispo.model')

// status disponible des produits
const StatusDispoModel = require('../models/statusDispo.model')
    //  Ligne de commande 
const ligneCommandeModel = require('../models/ligneCommande.model')
    // commande 
const CommandeModel = require('../models/commande.model')
    // statut commande 
const statutCommandeModel = require('../models/statutCommande.model')

const parametreModel = require('../models/parametre.model')

const messageModel = require('../models/message.model')
    // fake data 
const stautC = require('./fake/statusC')
const roleC = require('./fake/RoleC')
const profilC = require('./fake/profilU')
const statusDispo = require('./fake/statusDispo')
const FamilleProduit = require('./fake/familles')
const ProduitFake = require('./fake/produits')
const StatutCom = require('./fake/statutCom')
const contrainte = require('./fake/contrainte')

// Développement
/*const sequelize = new Sequelize('labase', 'root', 'MariaDB', {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: "+02:00",
    logging: false,

})*/

// Production
const sequelize = new Sequelize('labase', 'root', 'MariaDB', {
    host: 'localhost',
    dialect: 'mariadb',
    timezone: "+02:00",
    logging: false
})

const User = UserModel(sequelize, DataTypes)
const Statutcompt = StatutComptModel(sequelize, DataTypes)
const Role = RoleModel(sequelize, DataTypes)
const Profil = ProfilModel(sequelize, DataTypes)
const profil_role = ProfilRoleModel(sequelize, DataTypes)
const UserProfil = UserProfilModel(sequelize, DataTypes)
const Magasin = MagasinModel(sequelize, DataTypes)
const UserMagasin = UserMagasinModel(sequelize, DataTypes)
const Famille = FamilleModel(sequelize, DataTypes)
const Produit = ProduitModel(sequelize, DataTypes)
const StatusDispo = StatusDispoModel(sequelize, DataTypes)
const MiseADispo = MiseADispoModel(sequelize, DataTypes)
const ligneCommande = ligneCommandeModel(sequelize, DataTypes)
const commande = CommandeModel(sequelize, DataTypes)
const statutCommande = statutCommandeModel(sequelize, DataTypes)
const parametre = parametreModel(sequelize, DataTypes)
const message = messageModel(sequelize, DataTypes)
const abonnements = AbonnementModel(sequelize, DataTypes)


const initDb = () => {
    return sequelize.sync({ force: false }).then(_ => { //true permet de détruire la bdd

/*
     profilC.map(prof => {
            Profil.create({
                nom: prof.nom,
            }).then( )
     })

    roleC.map(roles => {
            Role.create({
                libelle: roles.libelle,
                route: roles.route,
                protocol: roles.protocol
            }).then(  )
        })

   

    stautC.map(status => {
                Statutcompt.create({
                        nom: status.nom,
                    })
                    //.then(status => console.log(status.toJSON()))
            })
            ///StatutCom

    StatutCom.map(status => {
            statutCommande.create({
                    id: status.id,
                    nom: status.nom,
                    ordre: status.ordre
                })
                //.then(status => console.log(status.toJSON()))
        })

    statusDispo.map(status => {
            StatusDispo.create({
                    nom: status.nom,
                })
                //.then(status => console.log(status.toJSON()))
        })

     


    User.create({
                nom: 'TATY',
                prenom: 'chekina',
                adresse: 'On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions',
                email: 'chektaty@gmail.com',
                tel: '07889645523',
                password: 'azerty',
                dateExp: '',
                statutcomptId: '1',
                profilId: '1'
            }).then()



        // add contrainte 

    contrainte.map(contraint => {
            parametre.create({
                    nom: contraint.nom,
                    nombre: contraint.nombre
                }).then()
        })


        console.log('*** /!\ La base de donnée a été initialisée /!\ ***');
*/
        console.log('La base de donnée est connectée');
    })
}


/**
 * liste des relations 
 */

Statutcompt.hasMany(User, { as: "users"});

User.belongsTo(Statutcompt, { foreignKey: "statutcomptId", as: "statutcompt" });


Profil.belongsToMany(Role, { through: 'profil_roles', foreignKey: 'profilId', otherKey: 'roleId' });
Role.belongsToMany(Profil, { through: 'profil_roles', foreignKey: 'roleId', otherKey: 'profilId' });

// relation table User et profile 
User.hasMany(UserProfil);
UserProfil.belongsTo(User);
Profil.hasMany(UserProfil);
UserProfil.belongsTo(Profil);

// relation table User et profile 
Profil.hasMany(User, { as: "users"});
User.belongsTo(Profil, { foreignKey: "profilId", as: "profil"});

// relation table User et magasin pour l'attribusion du magasin
User.hasMany(UserMagasin);
UserMagasin.belongsTo(User);
Magasin.hasMany(UserMagasin);
UserMagasin.belongsTo(Magasin);

// relation table user pour creation du magasin
User.hasMany(Magasin);
Magasin.belongsTo(User);

// relation entre table famille et sous famille 
Famille.hasMany(Produit, { as: "produit"});
Produit.belongsTo(Famille, { foreignKey: "familleId", as: "famille" });

// relation entre table MiseADispo et statusDispo 
StatusDispo.hasMany(MiseADispo, { as: "miseadispo" });
MiseADispo.belongsTo(StatusDispo);
// relation entre table MiseADispo et Produit
Produit.hasMany(MiseADispo, { as: "miseadispo" });
MiseADispo.belongsTo(Produit, { foreignKey: "produitId", as: "produit" });

// relation entre table MiseADispo et Magasin
Magasin.hasMany(MiseADispo, { as: "miseadispo"});
MiseADispo.belongsTo(Magasin, { foreignKey: "magasinId", as: "magasin" });

// relation entre table MiseADispo et Ligne de Commande 
MiseADispo.hasMany(ligneCommande, { as: "lignecommande"});
ligneCommande.belongsTo(MiseADispo, { foreignKey: "miseadispoId", as: "miseadispo"});

// relation entre table commande et Ligne de Commande  
commande.hasMany(ligneCommande, { as: "lignecommande"});
ligneCommande.belongsTo(commande, { foreignKey: "commandeId", as: "commande"});

//relataion entre user  et commande 
User.hasMany(commande, { as: "commande"});
commande.belongsTo(User, { foreignKey: "userId", as: "user"});

// relation  entre statutcommande et commande 
statutCommande.hasMany(commande, { as: "commande"});
commande.belongsTo(statutCommande, { foreignKey: "statutcommandeId", as: "statutcommande"});

module.exports = {
    initDb,
    Profil,
    Statutcompt,
    User,
    Role,
    profil_role,
    UserProfil,
    sequelize,
    UserMagasin,
    Magasin,
    Famille,
    Produit,
    StatusDispo,
    MiseADispo,
    ligneCommande,
    statutCommande,
    commande,
    parametre,
    message,
    abonnements


}