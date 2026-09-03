<?php
declare(strict_types=1);

session_start();

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal - LigaMagic</title>
    <link rel="stylesheet" href="public/css/global.css">
    <link rel="stylesheet" href="public/css/login.css">
    <link rel="stylesheet" href="public/css/toast.css">
</head>
<body>
    <div class="page">
        <main class="login-panel">
            <div class="panel-brand" aria-label="LigaMagic">
                <div>
                    <strong>Liga<span>Magic</span></strong>
                    <small>Portal administrativo</small>
                </div>
            </div>
            <h1>Bem-vindo(a) de volta</h1>
            <p class="subtitle">Acesse o gerenciador de cartas da sua equipe.</p>
            <form>
                <div class="field">
                    <label for="username">Usuário</label>
                    <div class="input-wrap">
                        <span class="icon" aria-hidden="true">  
                            <svg viewBox="0 0 24 24">
                                <path d="M16.5 8.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/>
                                <path d="M5 19a7 7 0 0 1 14 0"/>
                            </svg>
                        </span>
                        <input id="username" name="username" type="text" placeholder="Digite seu usuário" autocomplete="username">
                    </div>
                </div>

                <div class="field">
                    <label for="password">Senha</label>
                    <div class="input-wrap">
                        <span class="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <rect x="5" y="10" width="14" height="10" rx="2"/>
                                <path d="M8 10V7.5A4 4 0 0 1 16 7.5V10"/>
                            </svg>
                        </span>
                        <input id="password" name="password" type="password" placeholder="Digite sua senha" autocomplete="current-password">
                        <button type="button" class="toggle-password" aria-label="Mostrar senha">
                            <svg viewBox="0 0 24 24">
                                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <button id="submit-btn" class="submit-btn">Entrar</button>

                <div class="info" aria-label="Credenciais de demonstração">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="9"/>
                        <path d="M12 10.5v5"/>
                        <path d="M12 7.5h.01"/>
                    </svg>
                    <div class="info-text">
                        <strong>Credenciais de demonstração</strong>
                        <span>Usuário: <b>ADMIN</b> · Senha: <b>admin123</b></span>
                    </div>
                </div>
            </form>
        </main>
        <div class="copyright">© 2026 Portal. Todos os direitos reservados.</div>
    </div>
   <script type="module" src="public/js/bootstrap/login.js"></script>
</body>
</html>
