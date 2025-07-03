# Edited by Gagandeep Singh on 02/07/2025
# Task: Fixed subject filtering in /api/articles route to allow browsing by subject
# Team: Auckland CBD, IT6037 Project
from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import pymysql
import pymysql.cursors
import config

app = Flask(__name__)
app.secret_key = 'CHANGE_THIS_TO_SOMETHING_RANDOM'
CORS(app, supports_credentials=True)

# Helper: Get DB connection
def get_db():
    return pymysql.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        db=config.MYSQL_DB,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

# --- AUTH ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    with get_db().cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
    if not user or user['password'] != password:
        return jsonify({'success': False, 'msg': 'Invalid email or password.'}), 401

    # Save role and user id in session
    session['user_id'] = user['user_id']
    session['role_id'] = user['role_id']
    session['name'] = user['name']

    # Get role name
    with get_db().cursor() as cursor:
        cursor.execute("SELECT role_name FROM roles WHERE role_id=%s", (user['role_id'],))
        role = cursor.fetchone()
    return jsonify({
        'success': True,
        'role': role['role_name'],
        'name': user['name']
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

# --- SESSION STATUS ---
@app.route('/api/session', methods=['GET'])
def session_status():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'role_id': session['role_id'], 'name': session['name']})
    else:
        return jsonify({'logged_in': False})

# --- GET SUBJECTS ---
@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    with get_db().cursor() as cursor:
        cursor.execute("SELECT * FROM subjects GROUP BY SubjectName")
        subjects = cursor.fetchall()
    return jsonify(subjects)

# --- GET PEOPLE ---
@app.route('/api/people', methods=['GET'])
def get_people():
    with get_db().cursor() as cursor:
        cursor.execute("SELECT * FROM people")
        people = cursor.fetchall()
    return jsonify(people)

# --- ARTICLES (CRUD) ---
@app.route('/api/articles', methods=['GET'])
def get_articles():
    subject = request.args.get('subject')
    keyword = request.args.get('keyword')
    query = "SELECT * FROM articles"
    params = []
    filters = []
    if subject:
        # Filter by SubjectName, not Category
        with get_db().cursor() as cursor:
            cursor.execute("SELECT SubjectID FROM subjects WHERE SubjectName=%s", (subject,))
            subject_row = cursor.fetchone()
        if subject_row:
            filters.append("SubjectID = %s")
            params.append(subject_row["SubjectID"])
        else:
            return jsonify([])  # No such subject, return empty list
    if keyword:
        filters.append("Title LIKE %s")
        params.append(f"%{keyword}%")
    if filters:
        query += " WHERE " + " AND ".join(filters)
    with get_db().cursor() as cursor:
        cursor.execute(query, params)
        articles = cursor.fetchall()
    return jsonify(articles)

@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    with get_db().cursor() as cursor:
        cursor.execute("SELECT * FROM articles WHERE ArticleID=%s", (article_id,))
        article = cursor.fetchone()
    return jsonify(article) if article else ('', 404)

@app.route('/api/articles', methods=['POST'])
def create_article():
    # Only Tutor or Admin
    if session.get('role_id') not in [1,2]:
        return jsonify({'msg': 'Unauthorized'}), 403
    data = request.json
    fields = ("Title", "Category", "Type", "Year", "Medium", "Dimensions", "Location", "DesignedBy", "Developer", "SubjectID", "PersonID")
    values = [data.get(f) for f in fields]
    with get_db().cursor() as cursor:
        sql = f"INSERT INTO articles ({','.join(fields)}) VALUES ({','.join(['%s']*len(fields))})"
        cursor.execute(sql, values)
        article_id = cursor.lastrowid
    return jsonify({'success': True, 'ArticleID': article_id})

@app.route('/api/articles/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    # Only Tutor or Admin
    if session.get('role_id') not in [1,2]:
        return jsonify({'msg': 'Unauthorized'}), 403
    data = request.json
    fields = ("Title", "Category", "Type", "Year", "Medium", "Dimensions", "Location", "DesignedBy", "Developer", "SubjectID", "PersonID")
    set_clause = ', '.join([f"{f}=%s" for f in fields])
    values = [data.get(f) for f in fields]
    values.append(article_id)
    with get_db().cursor() as cursor:
        sql = f"UPDATE articles SET {set_clause} WHERE ArticleID=%s"
        cursor.execute(sql, values)
    return jsonify({'success': True})

@app.route('/api/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    # Only Admin
    if session.get('role_id') != 1:
        return jsonify({'msg': 'Unauthorized'}), 403
    with get_db().cursor() as cursor:
        cursor.execute("DELETE FROM articles WHERE ArticleID=%s", (article_id,))
    return jsonify({'success': True})

# --- USERS (only for Admin dashboard, optional) ---
@app.route('/api/users', methods=['GET'])
def get_users():
    if session.get('role_id') != 1:
        return jsonify({'msg': 'Unauthorized'}), 403
    with get_db().cursor() as cursor:
        cursor.execute("SELECT user_id, name, email, role_id FROM users")
        users = cursor.fetchall()
    return jsonify(users)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
