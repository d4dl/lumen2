<?php
class SessionManager {

    var $life_time;
    var $sessionCollection;

    function SessionManager($sessionCollection) {
        $this->sessionCollection = $sessionCollection;
        $this->life_time = get_cfg_var("session.gc_maxlifetime");
        $success = session_set_save_handler(
            array(&$this, "open"),
            array(&$this, "close"),
            array(&$this, "read"),
            array(&$this, "write"),
            array(&$this, "destroy"),
            array(&$this, "gc")
        );
        session_start();
        if(!$success) {
            throw new Exception("There was an error setting the save handler");
        }
    }

    function open($save_path, $session_name) {
        //error_log("=== Opening session");
        global $sess_save_path;
        $sess_save_path = $save_path;
        return true;
    }

    function close() {
        //error_log("=== Closing session");
        return true;

    }

    function read($id) {
        $time = time();
        $safeId = (string)$id;
        $query = array('$and' => array(
                          array('session_id' => $safeId),
                          array('expires' => array('$gt' => $time))
                        ));
        $session = $this->sessionCollection->findOne($query);
        //error_log("=== reading session " . json_encode($session) . " for id: " . $safeId . " time: " . $time);

        return $session ? $session['session_data'] : null;
    }

    function write($id, $data) {
        $time = time() + $this->life_time;
        $existingSession = $this->read($id);
        $ip_address = $this->get_ip();
        if($existingSession === null) {
            //error_log("Creating session $id for ip '" . $ip_address . "'");
        }
        //error_log("=== PHP Writing session with data " . json_encode($data));
        $session = $this->sessionCollection->update(
            array("session_id" => (string)$id),
            array("session_id" => (string)$id, "ip_address" => $ip_address, "session_data"=> (string)$data, "expires"=>$time),
            array("upsert"=>true));
        return TRUE;

    }

    function destroy($id) {
        //error_log("=== Destroying session");
        $this->sessionCollection->remove(array("session_id" => (string)$id));
        return TRUE;
    }

    function gc() {
        //error_log("=== Doing GC");
        $time = time();
        $this->sessionCollection->remove(array("expires" => array('$gt' => $time)));
        return true;
    }

    function get_ip() {
        //Just get the headers if we can or else use the SERVER global
        if ( function_exists( 'apache_request_headers' ) ) {
            $headers = apache_request_headers();
        } else {
            $headers = $_SERVER;
        }

        //Get the forwarded IP if it exists
        if ( array_key_exists( 'X-Forwarded-For', $headers ) && filter_var( $headers['X-Forwarded-For'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
            $the_ip = $headers['X-Forwarded-For'];
        } elseif ( array_key_exists( 'HTTP_X_FORWARDED_FOR', $headers ) && filter_var( $headers['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 )) {
            $the_ip = $headers['HTTP_X_FORWARDED_FOR'];
        } else {
            $the_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 );
        }
        return $the_ip;
    }
}

?>