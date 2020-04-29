# wapiLite &#10084; 📧

> Simple & light-weight transaction mail microservice service and editor

## Setup
The api that send the mail only support the **SMTP** protocole.
So you should add your SMTP credential from whatever mails service provider you want to use.
Here are the step to do that.

#### 1) create a .env file in the root folder:
```$ touch .env``` 

with macs and linux

#### 2) Add you SMTP credention in the .env file:
```
CLIENT=<project-comsuming-wapilite>
SMTP_HOST=<your-smtp-service-provider-host>
SMTP_PORT=<your-smtp-service-provider-port>
SMTP_USER=<your-smtp-service-provider-username>
SMTP_PWD=<your-smtp-service-provider-password>
SENDER_EMAIL=<email-address-to-send-mail>
```
Then you are done with the setup.

## Lunch the server
#### Install dependencies
```$ npm install```

#### Serve run the editor mode at localhost:3000
```$ npm run deveditor```

#### Serve in for production and launch server
```$ npm run start```

#### Generate static project
```$ npm run generate```

## Using the editor
First you should create a template.
The editor is compactible with HTML and the HTML superset [Inky](https://github.com/foundation/inky). 
## Using inky
#### Grid system
The Grid system is divided in 12 rows like in bootstrap.
To here is an examples:
```html
<row>
  <columns large="6"></columns>
  <columns small="6"></columns>
</row>
```

#### Containers
Containers put the content of your mail inside an element centered in the middle with a lighter backgroud like you often see in mails.
```html
<container class="classy">
    <row>
      <columns large="6">Foo</columns>
      <columns small="6">Bar</columns>
    </row>
</container>
```

#### Other inky tags you can try-out
```html
  button: <button>
  row: <row>
  columns: <columns>
  container: <container>
  inky: <inky>
  blockGrid: <block-grid>
  menu wrapper for multiple links: <menu>
  wrapped item for menu: <item>
```
## Sending a transaction
to send a transaction you got to make an http looking like this.
```
endpoint: http://<wapilite-endpoint>/api/v1/<template-name>
verb: POST
headers: {"Content-Type": "application/json"}
body: {
    "to": <email-of-reciever-in-string>,
    vars: {/* variable */}
}
```
Consider you already have a template called ```confirm_user``` and you want te send a mail to ```example@email.com```
your request will look like this:
```
endpoint: http://<wapilite-endpoint>/api/v1/confirm_user
verb: POST
headers: {"Content-Type": "application/json"}
body: {
    "to": "example@email.com",
    "vars": {/* variable */}
}
```

## Variable interpolation %{}
Tu set a variable inside your HTML or you mail subject you to user the following synthax
```%{foo}```. The portion of text that uses this synthax is then ready to be replaced with
the payload you'll attached to the body of post request to send a transaction.

Variable interpolation is supported in the subject input and the html editor.
Variable are shared between those two inputs.
#### Exemple:
Consider you already have a template called ```hello_world``` and you want te send a mail to ```example@email.com```

- subject of mail: ```Hello world %{foo}```
- content of mail:
```html
<container syle="background-color: %{color}">
    <row>
      <columns large="6">Hello world %{foo}</columns>
      <columns small="6">%{bar}</columns>
    </row>
</container>
```
- The request:
```
endpoint: http://<wapilite-endpoint>/api/v1/hello_world
verb: POST
headers: {"Content-Type": "application/json"}
body: {
    "to": "example@email.com",
    "vars": {
        "color": "blue",
        "foo": "of humans",
        "bar": "I'm a robot!"    
    }
}
```

## Iterator
This what you going to use when you want a certain portion of you template to repeat itself with variable.
For example imagine you want to send a mail once you user has completed an order of multiple products.

You could have a template called ```confirm_orders``` where you the products section to repeat itself for each products.
Your template could look like this:

- subject of mail: ```Hello %{username}, Your order is in process```
- content of mail:
```html
<container">
  <row>
    <h2>Hey %{username}, we are currently processing your order.</h2>
    You'll receive the shipping information with 24 hours.
  </row>
  <row>
    <h3>You order consist of:</h3>
    <iterate_ products>
        <row>
           <columns large="1">%{i.qty}</columns>
           <columns large="3">%{i.name}</columns>
           <columns large="5">%{i.description}</columns>
        </row>
    </iterate_>
  </row>
</container>
```
- The request:
```
endpoint: http://<wapilite-endpoint>/api/v1/confirm_orders
verb: POST
headers: {"Content-Type": "application/json"}
body: {
    "to": "example@email.com",
    "vars": {
        "username": "John Doe",
        "products": [
            {
                "qty": 3,
                "name": "computer keyboad",
                "description": "High quality cherry-mx brown keyboard with metal back plate."
            },
            {
                "qty": 3,
                "name": "Gaming mouse",
                "description": "10000dpi gaming mouse for e-sports professionals"
            },
            {
                "qty": 1,
                "name": "27inch 4k Monitor",
                "description": "Oled HDR 122Hz 27inch 4k Monitor"
            },
        ]   
    }
}
```

The iteration are recognize by the the html ```<iterate_ exemples>```
In the case above ```<iterate_ products>```.
For variables that need to be iterated on inside the iteration tag must use this iteration ```%{i.foo}```.

## Author
👤 Patje
