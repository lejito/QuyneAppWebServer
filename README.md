# QuyneApp

QuyneApp es un proyecto que consiste en una aplicación bancaria parecida a "**Nequi**" y que permite al usuario realizar diferentes tareas usuales en una aplicación de banca, como realizar transferencias a otras cuentas, hacer un seguimiento a sus movimientos recientes, hacer pagos de facturas, recargar tarjeta cívica, telefonía, comprar paquetes y más. 

<p align="center">
  <img src="https://github.com/lejito/QuyneAppWebServer/assets/88862376/02971460-3353-4600-8d07-ee2c1dd1442f">
</p>

Fue desarrollada por un equipo de 5 personas, conformado por **[Alejandro Córdoba Ríos](https://github.com/lejito)**, **[Adrián David Perdomo Echeverri](https://github.com/AdrianPerdomoE)**, **[Lorena Cadavid Gaviria](https://github.com/L0renaC)**, **[Juan David Londoño Arbelaez](https://github.com/obdrase)** y **[Viviana Andrea Muñoz Olarte](https://github.com/olarteViviana)**.

## QuyneAppWebServer

Este repositorio contiene el código de la aplicación backend y API (desarrollado con **NodeJS** y **ExpressJS**), al igual que los scripts de creación de modelos y estructuras (y backup) de la base de datos de **PostgreSQL**. Adicionalmente, se cuenta con una conexión a otro proyecto (backend y API) desarrollado por **[Alejandro Córdoba Ríos](https://github.com/lejito)** que consiste en una aplicación tipo "cooperativa financiera": [F4Y (Fin4Youth)](https://github.com/lejito/f4y-server).

### Modelo de datos
![image](https://github.com/lejito/QuyneAppWebServer/assets/88862376/7c796ce9-50bf-47be-9ecc-d84b9b943a13)

### Variables de entorno requeridas
```env
PORT=3000 #Puerto de ejecución del servidor
DBHOST=ep-round-king-60332880.us-east-2.aws.neon.fl0.io #Host de la base de datos
DBPORT=5432 #Puerto del servidor de la base de datos
DBUSER=fl0user #Usuario de la base de datos habilitado
DBPASSWORD=PQdfg0iIuV4h #Contraseña del usuario de la base de datos
DBNAME=quyneappdb #Nombre de la base de datos
SECRETJWT=UnDiaViUnaVacaSinColaVestidaDeUniforme #Clave secreta para la librería JSON Web Token
F4YURL=https://f4y-server-dev-adrn.3.us-1.fl0.io/api #URL de la API de la app F4Y
F4YKEY=TodoPorLaGestionDeLaConfiguracion #Clave secreta de conexión con la API de F4Y
```
