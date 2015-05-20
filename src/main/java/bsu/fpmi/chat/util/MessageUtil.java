package bsu.fpmi.chat.util;


import bsu.fpmi.chat.model.Message;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class MessageUtil {

    public static  final String TOKEN = "token";
    public static final String MESSAGES = "messages";
    private static final String TN = "TN";
    private static final String EN = "EN";
    private static final String USER = "user";
    private static final String MESSAGE = "message";
    private static final String ID = "id";

    public static String getToken(int index) {
        Integer number = index * 8 + 11;
        return TN + number + EN;
    }

    public static int getIndex(String token) {
        return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
    }

    public static JSONObject fromStringToJSON(String data) throws ParseException {
        JSONParser parser = new JSONParser();
        return (JSONObject) parser.parse(data.trim());
    }

    public static Message fromJsonToMessage(JSONObject json){
        String user = (String) json.get(USER);
        String messageText = (String) json.get(MESSAGE);
        if (user != null && messageText != null){
            return new Message(messageText, user);
        }
        return null;
    }

    public static Message fromJsonToMessageWithId(JSONObject json){
        String user = (String) json.get(USER);
        String messageText = (String) json.get(MESSAGE);
        String id = (String) json.get(ID);
        if (user != null && messageText != null){
            return new Message(messageText, user, Double.valueOf(id));
        }
        return null;
    }

}
