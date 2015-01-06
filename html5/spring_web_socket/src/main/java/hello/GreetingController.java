package hello;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.apache.log4j.Logger;

@Controller
public class GreetingController {

    volatile long miliTime = System.currentTimeMillis();
    Logger log = Logger.getLogger(GreetingController.class.getName());

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
//        Thread.sleep(3000); // simulated delay
        try {
            long currentMiliTime = System.currentTimeMillis();
            log.info(currentMiliTime - miliTime);

            return new Greeting("Hello, " + message.getName() + "!");
        } finally {
            miliTime = System.currentTimeMillis();
        }
    }

}
