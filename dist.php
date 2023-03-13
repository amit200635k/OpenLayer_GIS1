<?php
$host = "localhost";
$username = "postgres";
$password = "postgres";
$dbname = "accident";

$dsn = "pgsql:host=$host;port=5432;dbname=$dbname;user=$username;password=$password";
 
try{
 // create a PostgreSQL database connection
 $conn = new PDO($dsn);
 
 // display a message if connected to the PostgreSQL successfully
 if($conn){
 echo "Connected to the <strong>$dbname</strong> database successfully!";
 $stmt = $conn->prepare("SELECT id,dtname,ST_AsText(geom) as geoml,ST_AsEWKT(ST_GeomFromWKB(geom)) gg2 FROM district_boundary_jharkhand");
 $stmt->execute();
 
 while($row=$stmt->fetch(PDO::FETCH_ASSOC))
 {
  ?>
        <option id="<?php echo $row['dtname']; ?>" value="<?php echo $row['gg2']; ?>"><?php echo $row['dtname']; ?></option>
        <?php
 }
 }
}catch (PDOException $e){
 // report error message
 echo $e->getMessage();
}




?>