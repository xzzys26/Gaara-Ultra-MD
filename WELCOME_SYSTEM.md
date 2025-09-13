# GAARA ULTRA BOT - SISTEMA DE BIENVENIDA

## Comandos disponibles para administradores de grupo:

### Activar mensajes de bienvenida y despedida:
```
.on welcome
```
o también:
```
.onwelcome
```

### Desactivar mensajes de bienvenida y despedida:
```
.off welcome  
```
o también:
```
.offwelcome
```

### Establecer mensaje personalizado de bienvenida:
```
.setwelcome ¡Bienvenido @user al grupo!
```

### Establecer mensaje personalizado de despedida:
```
.setbye Adiós @user, hasta la vista
```

## ¿Cómo funciona?

1. **Por defecto**: Cuando activas con `.on welcome`, el bot enviará una imagen/tarjeta personalizada para dar la bienvenida a nuevos miembros y despedir a los que se van.

2. **Mensajes personalizados**: Si configuras un mensaje con `.setwelcome` o `.setbye`, el bot enviará ese texto en lugar de la imagen.

3. **Variables**: Usa `@user` en tus mensajes personalizados para mencionar al usuario.

4. **Permisos**: Solo los administradores del grupo pueden usar estos comandos.

5. **Ambos tipos**: El comando `.on welcome` activa tanto bienvenidas como despedidas. El comando `.off welcome` desactiva ambos.

## Solución aplicada:

✅ **Problema resuelto**: Los comandos `.on welcome` y `.off welcome` ahora funcionan correctamente
✅ **Prefijo configurado**: Se agregó el prefijo "." en la configuración
✅ **Compatibilidad**: Funciona tanto con `.on welcome` como con `.onwelcome`
✅ **Eventos**: El sistema responde a usuarios que entran y salen del grupo
✅ **Imágenes**: Genera tarjetas de bienvenida/despedida automáticamente
✅ **Base de datos**: Guarda la configuración por grupo correctamente