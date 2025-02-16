
# Guide de Test de Sécurité avec OWASP ZAP

## Prérequis
- OWASP ZAP installé sur votre machine
- Application de microservices en cours d'exécution

## Étapes pour tester la désérialisation des objets et l'injection entre services

### 1. Lancer OWASP ZAP
Ouvrez OWASP ZAP sur votre machine.

### 2. Configurer le Proxy
Configurez votre navigateur pour utiliser OWASP ZAP comme proxy. Par défaut, OWASP ZAP utilise le port 8080.

### 3. Intercepter le Trafic
Naviguez dans votre application de microservices pour permettre à OWASP ZAP d'intercepter le trafic.

### 4. Scanner l'Application
Utilisez l'option "Automated Scan" de OWASP ZAP pour scanner votre application. Cela permettra d'identifier les vulnérabilités potentielles.

### 5. Analyser les Résultats
Une fois le scan terminé, analysez les résultats pour identifier les vulnérabilités de désérialisation des objets et d'injection entre services.

### 6. Tester Manuellement
Utilisez les fonctionnalités de test manuel de OWASP ZAP pour tester des scénarios spécifiques de désérialisation et d'injection.

### 7. Corriger les Vulnérabilités
Corrigez les vulnérabilités identifiées dans votre code source et répétez les tests pour vous assurer que les problèmes ont été résolus.

## Ressources Utiles
- [OWASP ZAP Documentation](https://www.zaproxy.org/documentation/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

