function generarCodigoPayload() {
  const nombreProcedimiento = document.getElementById(
    "nombreProcedimiento"
  ).value;
  const nombreEsquema = document.getElementById("nombreEsquema").value;
  const tableName = document.getElementById("tableName").value;
  const tableComment = document.getElementById("tableComment").value;
  const columns = document.getElementById("columns").value;

  const serviceName =
    nombreProcedimiento.charAt(0).toUpperCase() +
    nombreProcedimiento.slice(1) +
    "Service";

  const codigoGenerado = `
        // back\\src\\main\\java\\co\\gov\\policia\\pwa\\payload\\response\\${nombreProcedimiento}Response.java
        
        package co.gov.policia.pwa.payload.response;
        
        import java.util.List;
        
        import co.gov.policia.pwa.entity.${nombreProcedimiento};
        import lombok.AllArgsConstructor;
        import lombok.Data;
        import lombok.NoArgsConstructor;
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public class ${nombreProcedimiento}Response {
            List<${nombreProcedimiento}> msg;
            private Long code;
            private String message;
            private Long consecutivo;
        }
        `;

  // Mostrar el código generado en el elemento de salida
  document.getElementById("output").textContent = codigoGenerado;
}
