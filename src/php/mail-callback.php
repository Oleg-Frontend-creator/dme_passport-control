<?php
//проверяем тип запроса, обрабатываем только POST
if ($_SERVER ["REQUEST_METHOD"] = "POST") {

    // Получаем параметры, посланные с javascript
    $name = $_POST['name'];
    $phone = $_POST ['phone'];
    $email = $_POST['email'];
    // создаем переменную с содержанием письма
    $content = $name . ' оставил заявку на звонок по поводу трудоустройства на должность контролера ПК.' . 'Его телефон: ' . $phone .', его email: ' . $email;

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";

    // Первый параметр - кому отправляем письмо, второй - тема письма, третий - содержание
    $success = mail("dmd_passport_control@mail.ru", 'Заявка на обратный звонок', $content);

    if ($success) {
        // отдаем 200 код ответа на http запрос
        http_response_code (200);
        echo "Письмо отправлено";
    } else {
        // Отдаем ошибку с кодом 500 (internal server error).
        http_response_code (500);
        echo "Письмо не отправлено";
    }

} else {
    // Если это не POST запрос - возвращаем код 403 (действие запрещено)
    http_response_code(403);
    echo "Данный метод запроса не поддерживается сервером";
}
