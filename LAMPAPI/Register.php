<?php

//Place user values into variables
$inData = getRequestInfo();
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["userName"];
$password = $inData["password"];


$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 

if($conn->connect_error){

    returnWithError($conn->connect_error);

} else{
    
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
    $stmt->bind_param("s", $login);
    $stmt->execute();

    $result = $stmt->get_result();

    //Check if Login already exists
    if($row = $result->fetch_assoc()){
        returnWithError("Username is already taken.");
    } else{
        //Insert Users
        $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $password = md5($password);
        $stmt->bind_param('ssss', $firstName, $lastName, $login, $password);
        $stmt->execute();

        $stmt->close();
        $conn->close();
        returnWithError("");
    }
} 



function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>