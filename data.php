<?php
function makeSafe($text) {
    return htmlspecialchars(stripslashes(trim($text)));
}

function numberToDay($num) {
    switch ($num) {
        case 1:
            return "M";
            break;
        case 2:
            return "T";
            break;
        case 3:
            return "W";
            break;
        case 4:
            return "R";
            break;
        case 5:
            return "F";
            break;
        default:
            return "S";
    }
}

header('Content-Type: text/javscript');

include_once '../includes_viewer.php';

$cxn = new mysqli(HOST, USER, PASSWORD, DATABASE);
if ($cxn->connect_error) {
    die("Connection failed: Contact admin");
}

// get the subjects and courses
$sql = "SELECT fpts_subjects.name AS subject, fpts_courses.name AS course
        FROM fpts_courses LEFT JOIN fpts_subjects ON fpts_courses.subject =
        fpts_subjects.id ORDER BY fpts_courses.subject, fpts_courses.id";
$result = $cxn->query($sql);
if ($result->num_rows > 0) {
    echo "\nvar subjects = [";
    $curSubj = "";
    $isFirst = true;
    while ($row = $result->fetch_assoc()) {
        //$course = str_replace(" ", "&nbsp;", $row["course"]);
        $course = $row["course"];
        if ($row["subject"] != $curSubj) {
            $curSubj = $row["subject"];
            if ($isFirst) {
                $isFirst = false;
            } else {
                echo "]},";
            }
            echo "\n    {name:\"$curSubj\", courses:[\"";
            echo "$course\"";
        } else {
            echo ", \"$course\"";
        }
    }
    echo "]}\n];\n\n";
}

// get the tutor's names and tutor courses
$sql = "SELECT fpts_tutor_names.name AS tutor, fpts_courses.name AS course
        FROM fpts_tutor_courses
        LEFT JOIN fpts_tutor_names ON fpts_tutor_names.id = fpts_tutor_courses.tutor
        LEFT JOIN fpts_courses ON fpts_courses.id = fpts_tutor_courses.course";
$result = $cxn->query($sql);
$tutorToCourses = array();
if ($result-> num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (!array_key_exists($row["tutor"], $tutorToCourses)) {
            $tutorToCourses[$row["tutor"]] = array();
        }
        array_push($tutorToCourses[$row["tutor"]], $row["course"]);
    }
}

$sql = "SELECT fpts_tutor_names.name AS tutor, fpts_tutor_hours.day AS day,
        fpts_tutor_hours.hours AS hours, fpts_tutor_hours.notes AS notes
        FROM fpts_tutor_hours
        LEFT JOIN fpts_tutor_names ON fpts_tutor_names.id = fpts_tutor_hours.tutor";
$result = $cxn->query($sql);
$tutorToHours = array();
if ($result-> num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (!array_key_exists($row["tutor"], $tutorToHours)) {
            $tutorToHours[$row["tutor"]] = array();
        }
        $hoursFormat = numberToDay((int) $row["day"]) . " " .
            $row["hours"];
        if (!empty($row["notes"])) {
            $hoursFormat .= " " . $row["notes"];
        }
        array_push($tutorToHours[$row["tutor"]], $hoursFormat);
    }
}
    
echo "var Tutors = [";
$isFirst = true;
foreach ($tutorToCourses as $tutor => $courses) {
    if ($isFirst) {
        $isFirst = false;
    } else {
        echo "]\n    }, ";
    }
    echo "\n    {name:\"$tutor\", \n     courses:[";
    
    $isFirst = true;
    foreach ($courses as $course) {
        //$newCourse = str_replace(" ", "&nbsp;", $course);
        $newCourse = $course;
        if ($isFirst) {
            $isFirst = false;
            echo "\"$newCourse\"";
        } else {
            echo ", \"$newCourse\"";
        }
    }
    echo "], \n     hours:[";
    $isFirst = true;
    if (!array_key_exists($tutor, $tutorToHours)) {
        $tutorToHours[$tutor] = array();
    }
    foreach ($tutorToHours[$tutor] as $hours) {
        if ($isFirst) {
            $isFirst = false;
            echo "\"$hours";
        } else {
            echo ", \"$hours";
        }
        echo "\"";
    }
    $isFirst = false;
}
echo "]\n    }\n];\n";
/*foreach ($tutorToCourses as $tutor => $courses) {
    echo "$tutor Does:\n";
    foreach ($courses as $course) {
        echo "     $course,\n";
    }
    echo "     During:\n";
    foreach ($tutorToHours[$tutor] as $hours) {
        echo "        $hours,\n";
    }
}*/

?>