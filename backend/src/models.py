from src import db


class User(db.Model):
    """ Data gouv fr users Model """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    first_name = db.Column(db.String(255), unique=True, nullable=False)
    last_name = db.Column(db.String(255), unique=True, nullable=False)
    dgf_id = db.Column(db.String(255), unique=True, nullable=False)
    comments = db.relationship('Comment', backref='author', lazy='dynamic')

    def __repr__(self):
        return f"<User {self.id} {self.first_name} {self.last_name}>"


class DgfObject(db.Model):
    """ Data gouv fr objects Model """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    suspicious = db.Column(db.Boolean())
    read = db.Column(db.Boolean())
    deleted = db.Column(db.Boolean())
    dgf_type = db.Column(db.Enum('user', 'community_resource', 'organization', 'dataset', 'reuse', name='dgf_type'))
    dgf_id = db.Column(db.String(255), nullable=False)
    comments = db.relationship('Comment', backref='dgf_object', lazy='dynamic')

    def __repr__(self):
        return f"<Dgf {self.dgf_type} with id {self.dgf_id}>"


class Comment(db.Model):
    """ Comments related to Data gouv fr objects Model """
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    written_at = db.Column(db.DateTime, nullable=False)
    content = db.Column(db.String(255), nullable=False)
    dgf_object_id = db.Column(db.Integer, db.ForeignKey('dgf_object.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f"<Comment {self.id} by {self.author}>"
