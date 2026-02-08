## Installation
Make sure to have **Python 3.13** installed

```bash
    cd server
    python -m venv venv
    venv/Scripts/activate.ps1
```

Install required libraries
```bash
    pip install -r requirements.txt
```

## Startup
Create your **.env** file, paste and fill in these values with the appropriate data

- DEBUG=True|Fasle
- SECRET_KEY=string
- EMAIL_HOST_USER=someone@example.com
- EMAIL_HOST_PASSWORD=your_app_password

Then run these commands in your terminal
```bash
    python manage.py migrate
    python manage.py runserver
```

## View swagger docs on 
http://localhost:8000/swagger