var fs = require('fs');

exports.fruits = (req, res) => {
	var session = req.session;
	var user = session.user;

	var fruit = "SELECT * FROM produitsi";

	db.query(fruit, (err, results) => {
		res.render('fruits.ejs', {
			title: 'Tous les fruits',
			user: user,
			fruits: results,
			message: ''
		});
	});	
};

exports.inscription = (req, res) => {
	res.render('inscription.ejs', {
		title: 'Inscrivez-vous',
		message: ''
	});
};

exports.inscriptionPage = (req, res) => {
	var name = req.body.name;
	var firstname = req.body.firstname;
	var email = req.body.email;
	var phone = req.body.phone;
	var password = req.body.password;
	var passwordConfirm = req.body.word;

	if (password == passwordConfirm) {
		var requete = "INSERT INTO user (nom, prenom, email, tel, password) VALUES (?, ?, ?, ?, ?)";
		db.query(requete, [name, firstname, email, phone, password], (err, res) => {
			if (err) {
				return res.status(500).send(err);
			} else {
				res.redirect('/connexion');
			}
		});
	} else {
		res.render('inscription.ejs', {
			title: 'Inscrivez-vous',
			message: 'Les mots de passe ne correspondent pas !'
		});
	}
};

exports.connexionPage = (req, res) => {
	res.render('connexion.ejs', {
		title: 'Connexion',
		message: ''
	});
};

exports.connexion = (req, res) => {
	var email = req.body.email;
	var password = req.body.password;
	var session = req.session;

	if (email && password) {
		var check = "SELECT * FROM user WHERE email = ? AND password = ?";

		db.query(check, [email, password], (err, result) => {
			if (result.length > 0) {
				session.userID = result[0].id;
				session.user = result[0];
				res.redirect('/');
			} else {
				res.render('connexion.ejs', {
					title: 'Connexion',
					message: 'Vérifiez votre login ou votre mot de passe !'
				});
			}
		});
	} else {
		res.end();
	}
};

exports.deconnexion = (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send(err);
		} else {
			return res.redirect('/');
		}
	})
};

exports.accueil = (req, res) => {
	var session = req.session;
	var user = session.user;

	res.render('index.ejs', {
		title: 'Market',
		user: user
	});
};

/*exports.admin = (req, res) => {
	var session = req.session;
	var user = session.user;

	res.render('admin.ejs', {
		title: 'Tableau de bord',
		user: user
	});
};*/

exports.ajouterProduit = (req, res) => {
	var session = req.session;
	var user = session.user;

	res.render('ajouter-produit.ejs', {
		title: 'Ajouter un produit',
		user: user
	});
};

exports.ajouterProduitPost = (req, res) => {
	var session = req.session;
	var user = session.user;
	var prix = req.body.prix;
	var nom = req.body.nom;
	var description = req.body.description;
	var categorie = req.body.categorie;
	var uploadedFile = req.files.image;
	var type = req.body.type;
	var nomImage = uploadedFile.name;
	var fileExtension = uploadedFile.mimetype.split('/')[1];
	nomImage = nom + '.' + fileExtension;

	var ajouter = "SELECT * FROM produits WHERE nom = ? AND description = ?";

	db.query(ajouter, [nom, description], (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		if (result.length > 0) {
			message = 'Produit déjà enregistré.';
			res.render('ajouter-produit.ejs', {
				message,
				title: 'Ajouter un produit',
				user: user
			});
		} else {
			if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
				uploadedFile.mv(`public/images/${nomImage}`, (err) => {
					if (err) {
						return res.status(500).send(err);
					}

					var insert = "INSERT INTO produits (nom, description, prix, image, categorie, type_produit) VALUES (?,?,?,?,?,?)";
					db.query(insert, [nom, description, prix, nomImage, categorie, type], (err,  result) => {
						if (err) {
							return res.status(500).send(err);
						}
						res.redirect('/espace-administration');
					});
				});
			} else {
				message = 'Format invalide.';
				res.render('ajouter-produit.ejs', {
					message,
					title: 'Ajouter un produit',
					user: user
				});
			}
		}
	});
};

exports.admin = (req, res) => {
	var session = req.session;
	var user = session.user;

	var voir = "SELECT * FROM produits";

	db.query(voir, (err, results) => {
		res.render('admin.ejs', {
			title: 'Tableau de bord',
			user: user,
			produits: results,
			message: ''
		});
	});	
};

exports.view = (req, res) => {
	var session = req.session;
	var user = session.user;
	var produitID = req.params.id;

	var view = "SELECT * FROM produits WHERE id = ?";

	db.query(view, [produitID], (err, result) => {
		res.render('detail-produit.ejs', {
			title: 'Detail produit',
			user: user,
			produit: result[0]
		});
	});	
};