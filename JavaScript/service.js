function generarCodigoService() {
    
        const nombreProcedimiento = document.getElementById("nombreProcedimiento").value;
        const nombreEsquema = document.getElementById("nombreEsquema").value;
        const tableName = document.getElementById("tableName").value;
        const tableComment = document.getElementById("tableComment").value;
        const columns = document.getElementById("columns").value;
    
        // Formatear el nombre de la clase para el servicio
        const serviceName = nombreProcedimiento.charAt(0).toUpperCase() + nombreProcedimiento.slice(1) + "Service";
    
        // Crear el código del servicio
        const codigoService = `
    package co.gov.policia.pwa.service;
    
    import java.io.Serializable;
    import org.springframework.http.ResponseEntity;
    import co.gov.policia.pwa.entity.${nombreProcedimiento};
    
    //MODIFIQUE EL SIGUIENTE CÓDIGO DE ACUERDO A LA NECESIDAD
    public interface ${serviceName} extends Serializable {
        
        public ResponseEntity<?> crearConducta(${nombreProcedimiento} conducta);
    
        public ResponseEntity<?> obtenerConductaPorId(Long consecutivo);
    
        public ResponseEntity<?> obtenerConductaPorIdDelito(Long consecutivoDelito);
    
        public ResponseEntity<?> obtenerTipoConductaPorIdTipo(Long consecutivoTipoDelito);
    
        public ResponseEntity<?> obtenerConductasPorProcedimiento(Long consecutivoProcedimiento);
    
        public ResponseEntity<?> eliminarConducta(${nombreProcedimiento} conducta);
    }
    `;
    
        // Mostrar el código generado en el HTML
        document.getElementById("output").textContent = codigoService.trim();
    
    }
    