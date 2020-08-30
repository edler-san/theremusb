# Demo project for typescript in Vaadin 16

This project creates a theremin-like experience in your browser. An audio generator based on your connected USB devices will be be created which you can play with with your mouse. (A default generator is provided if you don't want or can't access the USB devices on your system.)

The project is a standard Maven project, so you can import it to your IDE of choice. You'll need to have Java 8+ and Node.js 10+ installed.

To run from the command line, use `mvn spring-boot:run` and open [http://localhost:8080/theremusb](http://localhost:8080/theremusb) in your browser.


# Online demo

Visit [https://ronny.app.fi/web/theremusb](https://ronny.app.fi/web/theremusb) to test it out. Requires browser with WebUSB support! (Currently this is only Chrome)
