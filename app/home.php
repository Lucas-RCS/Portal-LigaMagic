<?php
declare(strict_types=1);

session_start();

if (empty($_SESSION['logged'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciador de Cartas · Portal</title>
    <link rel="stylesheet" href="public/css/home.css">
</head>
<body>
    <div class="app-shell">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-brand">
                <strong>Liga<span>Magic</span></strong>
            </div>

            <nav class="sidebar-menu" data-sidebar-menu></nav>

            <div class="sidebar-footer">
                <button type="button" class="sidebar-link sidebar-logout" data-logout>
                    <span class="sidebar-icon">
                        <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                    </span>
                    <span class="sidebar-label">Sair</span>
                </button>
            </div>
        </aside>

        <div class="app-content">
            <header class="topbar">
                <div class="topbar-copy">
                    <h1 class="topbar-title">Gerenciador de Cartas</h1>
                </div>

                <div class="topbar-actions">
                    <div class="user-menu">
                        <span class="avatar" aria-hidden="true"></span>
                        <div class="user-data">
                            <span class="user-name"><?= $_SESSION["userName"] ?></span>
                        </div>
                    </div>
                </div>
            </header>

            <main class="content" id="view-root"></main>
        </div>
    </div>

    <div id="modal-root"></div>

    <script>
        window.username = "<?= $_SESSION["userName"] ?>";
    </script>
    <script type="module" src="public/js/bootstrap/home.js"></script>
</body>
</html>
