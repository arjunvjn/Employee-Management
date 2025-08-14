# Employee Management System.



## 📋 Description

A full-stack built Employee Management System application with a React frontend and Django REST Framework (DRF) backend. Users can register, log in, create form, and manage employee with full CRUD functionality.


## 🚀 Features

### User Management
- **User Creation**: Register new users.
- **Authentication**: Secure login using **JWT** (JSON Web Tokens).
- **User Update**: User can update their profile and password.
- **Logout**: Secure logout functionality.

### Dynamic Form Management
- **Form Creation**: User can create dynamic form.
- **Form Update**: User can update the form fields.

### Employee Management
- **Employee CRUD**:Users can create, read, update, and delete employee records.

## 🛠️ Technologies Used

**Frontend:**
- **React.js**
- **Axios** for API requests.
- **React Router DOM** for routing.
- **Material UI** for UI components and styling.

**Backend:**
- **Django REST Framework**
- **PostgreSQL**
- **Django Rest Framework SimpleJWT** for authentication.


## 🔧 Setup Instructions

### Prerequisites
- **Python**
- **Node.js**
- **pip** (Python package installer)
- **venv** (for creating a virtual environment)
- **PostgreSQL** (For the database)


### Installation Steps

**Clone the Repository:**

```bash
    git clone https://github.com/arjunvjn/Employee-Management.git
```

 #### Backend Setup

```bash
    cd Employee-Management
    cd EmployeeManagement
    cd backend
```
 **Create and Activate a Virtual Environment:**

```bash

    # Create virtual environment
    python -m venv myenv

    # Activate virtual environment
    # On macOS/Linux:
    source myenv/bin/activate

    # On Windows (Command Prompt):
    myenv\Scripts\activate

    # On Windows (PowerShell):
    myenv\Scripts\Activate.ps1
```

 **Install the Required Packages:**

```bash
    pip install -r requirements.txt
```

 **Setup the .env File:**

Create a .env file in the root of your project (next to manage.py).

```bash
    # PostgreSQL settings
    DB_NAME=your-database-name
    DB_USER=your-database-user
    DB_PASSWORD=your-database-password
    DB_HOST=localhost
    DB_PORT=5432
```

 **Migrate the Database:**

```bash
    python manage.py migrate
```

 **Run the Django Server:**

```bash
    python manage.py runserver
```
 #### Frontend Setup

 Open a new terminal and 
```bash
    cd Employee-Management
    cd EmployeeManagement
    cd frontend
 ```

**Install the Required Packages:**
```bash
    npm install
```
**Run the React Server:**

```bash
    npm start
```



## 📬 Postman Collection
Postman Documentation link - https://documenter.getpostman.com/view/20668961/2sB3BGHpVD
