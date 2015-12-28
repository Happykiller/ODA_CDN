<?php
/**
 * Created by PhpStorm.
 * User: Happykiller
 * Date: 19/12/2015
 * Time: 14:44
 */
echo "Enter your login : ";
$handle = fopen ("php://stdin","r");
$login = rtrim(fgets($handle));
echo "Enter your password : ";
$handle = fopen ("php://stdin","r");
$password = crypt(rtrim(fgets($handle)));
echo "A ajouter au .htpasswd\n";
echo $login.":".$password."\n";
echo "Thank you.\n";