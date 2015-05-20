package bsu.fpmi.chat.model;


public class Message {

    private String message;
    private String user;
    private double id;

    public Message(String message, String user) {
        this.message = message;
        this.user = user;
        id = Math.random();
    }

    public Message(String message, String user, double ID) {
        this.message = message;
        this.user = user;
        this.id = ID;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public double getId() {
        return id;
    }

    public void setId(double id) {
        this.id = id;
    }

    public boolean delete(){
        try {
            this.message = "Message was deleted";
            this.user = "System";
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    public boolean edit(String newMessage){
        try{
            this.message = newMessage;
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"id\":\"").append(id)
                .append("\", \"user\":\"").append(user)
                .append("\", \"message\":\"").append(message)
                .append("\"}");
        return sb.toString();
    }

}