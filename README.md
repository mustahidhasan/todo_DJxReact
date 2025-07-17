# todo_DJxReact

# Backend for a simple Todo application using Django
- User can register, login, create, update, delete and view todos.
- The application uses Django Rest Framework for API development.
- The frontend is built using React, which consumes the APIs provided by Django.
- The project is structured to separate concerns between the frontend and backend.


# Frontend
- The frontend is built using React.
- It consumes the APIs provided by the Django backend.
- The frontend is responsible for user interactions and displaying todos.


# Features
- User registration and authentication.
- Create, update, delete, and view todos.
- Responsive design for better user experience.

# Rnn the Backend
1. Navigate to the backend directory:
    ```bash 
    cd backend
    ```
2. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```
3. Run the migrations:
    ```bash
    python manage.py migrate
    ```
4. Create a superuser (optional, for admin access):
    ```bash
    python manage.py createsuperuser
    ```
5. Run the development server:
    ```bash
    python manage.py runserver
    ```
# Run the Frontend
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install the required packages:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ``` 
# Note
- Ensure that the backend server is running before starting the frontend.
- The frontend will make API calls to the backend server to fetch and manipulate todos.

