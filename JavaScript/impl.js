function generarCodigoImpl() {
  const nombreProcedimiento = document
    .getElementById("nombreProcedimiento")
    .value.trim();
  const nombreEsquema = document.getElementById("nombreEsquema").value.trim();
  const tableName = document.getElementById("tableName").value.trim();
  const tableComment = document.getElementById("tableComment").value.trim();
  const columns = document.getElementById("columns").value.trim();

  if (
    !nombreProcedimiento ||
    !nombreEsquema ||
    !tableName ||
    !tableComment ||
    !columns
  ) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Parse columns
  const columnLines = columns.split(";");
  const inputParams = [];
  const outputParams = [];

  columnLines.forEach((line) => {
    const parts = line.split(",");
    if (parts.length >= 2) {
      const columnName = parts[0].trim();
      const columnType = parts[1].trim().toUpperCase();
      let jsType = "String"; // Default type

      if (columnType.includes("NUMBER")) {
        jsType = "Long";
      } else if (columnType.includes("DATE")) {
        jsType = "Date";
      }

      inputParams.push({
        name: columnName,
        type: jsType,
      });
    }
  });

  // Generate input parameter code
  const inputParamCode = inputParams
    .map(
      (param) =>
        `storedProcedureQuery.registerStoredProcedureParameter("i_${param.name}", ${param.type}.class, ParameterMode.IN);`
    )
    .join("\n        ");

  const setParameterCode = inputParams
    .map(
      (param) =>
        `storedProcedureQuery.setParameter("i_${
          param.name
        }", conducta.get${capitalize(param.name.toLowerCase())}());`
    )
    .join("\n        ");

  const outputCode = `
    storedProcedureQuery.registerStoredProcedureParameter("o_CONSECUTIVO", Long.class, ParameterMode.OUT);
    storedProcedureQuery.registerStoredProcedureParameter("o_RESPUESTA", Long.class, ParameterMode.OUT);
    storedProcedureQuery.registerStoredProcedureParameter("o_DESC_RESULTADO", String.class, ParameterMode.OUT);`;

  const generatedCode = `

 // back\src\main\java\co\gov\policia\pwa\service\impl\PrConductasServiceImpl.java

package co.gov.policia.pwa.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.ParameterMode;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import co.gov.policia.pwa.entity.${nombreProcedimiento};
import co.gov.policia.pwa.payload.response.${nombreProcedimiento}Response;
import co.gov.policia.pwa.service.${nombreProcedimiento}Service;

@Service
public class ${nombreProcedimiento}ServiceImpl extends AbstractService implements ${nombreProcedimiento}Service{
    
    @Lazy
    @Autowired
    ${nombreProcedimiento}Service ${nombreProcedimiento.toLowerCase()}Service;

    @Override
    @Transactional
    public ResponseEntity<?> crear${capitalize(
      nombreProcedimiento
    )}(${capitalize(nombreProcedimiento)} conducta){

        String procedimiento= "PK_${tableName}.PR_INSERT_${tableName}";

        StoredProcedureQuery storedProcedureQuery = em.createStoredProcedureQuery(procedimiento);        

        ${inputParamCode}

        ${outputCode}

        ${setParameterCode}
        
        storedProcedureQuery.execute();

        Long response = (Long) storedProcedureQuery.getOutputParameterValue("o_RESPUESTA");
        String responseDescription = (String) storedProcedureQuery.getOutputParameterValue("o_DESC_RESULTADO");
        long responseConsecutivo = (Long) storedProcedureQuery.getOutputParameterValue("o_CONSECUTIVO");

        return ResponseEntity.ok(new ${nombreProcedimiento}Response(null, response, responseDescription, responseConsecutivo));
    }

   // MODIFIQUE EL SIGUIENTE CÓDIGO DE ACUERDO A LA NECESIDAD 
    
    @Lazy
    @Override
    @Transactional
    public ResponseEntity<?> eliminarConducta(PrConductas conducta) {

        String procedimiento= "PK_PR_CONDUCTAS.PR_DELETE_PR_CONDUCTAS";
        
        StoredProcedureQuery storedProcedureQuery = em.createStoredProcedureQuery(procedimiento);        

        storedProcedureQuery.registerStoredProcedureParameter("i_CONSECUTIVO", Long.class, ParameterMode.IN);
        storedProcedureQuery.registerStoredProcedureParameter("o_RESPUESTA", Long.class, ParameterMode.OUT);
        storedProcedureQuery.registerStoredProcedureParameter("o_DESC_RESULTADO", String.class, ParameterMode.OUT);

        storedProcedureQuery.setParameter("i_CONSECUTIVO", conducta.getConsecutivo());

        storedProcedureQuery.execute();

        Long response = (Long) storedProcedureQuery.getOutputParameterValue("o_RESPUESTA");
        String responseDescription = (String) storedProcedureQuery.getOutputParameterValue("o_DESC_RESULTADO");        

        return ResponseEntity.ok(new PrConductasResponse(null, response, responseDescription, null));
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public ResponseEntity<?> obtenerConductaPorId(Long consecutivo){
        List<PrConductas> listaConductas = new ArrayList<>();

        Long code = null;
        String mensaje = "";
        Query q = null;

        try {
            String query = "SELECT * FROM PR_CONDUCTAS WHERE CONSECUTIVO = ?";

            q = em.createNativeQuery(query, PrConductas.class);
            q.setParameter(1, consecutivo);

            listaConductas = q.getResultList();

            if(listaConductas.size() > 0){
                code = 0L;
                mensaje = "se encontró información";
            }else{
                code = 2L;
                mensaje = "No se encontró información";
            }

            return ResponseEntity.ok(new PrConductasResponse(listaConductas, code, mensaje, null));

        } catch (Exception e) {
            return ResponseEntity.ok("falló consultar conducta por id");
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public ResponseEntity<?> obtenerConductaPorIdDelito(Long consecutivoDelito){

        List<PrConductas> listaConductas = new ArrayList<>();

        Long code = null;
        String mensaje = "";
        Query q = null;

        try {
            String query = "SELECT * FROM PR_CONDUCTAS WHERE CONS_DELITO = ?";

            q = em.createNativeQuery(query, PrConductas.class);
            q.setParameter(1, consecutivoDelito);

            listaConductas = q.getResultList();

            if(listaConductas.size() > 0){
                code = 0L;
                mensaje = "se encontró información";
            }else{
                code = 2L;
                mensaje = "No se encontró información";
            }

            return ResponseEntity.ok(new PrConductasResponse(listaConductas, code, mensaje, null));

        } catch (Exception e) {
            return ResponseEntity.ok("falló consultar conducta por id");
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public ResponseEntity<?> obtenerTipoConductaPorIdTipo(Long consecutivoTipoDelito){

        List<PrConductas> listaConductas = new ArrayList<>();

        Long code = null;
        String mensaje = "";
        Query q = null;

        try {
            String query = "SELECT * FROM PR_CONDUCTAS WHERE CONS_TIPO_DELITO = ?";

            q = em.createNativeQuery(query, PrConductas.class);
            q.setParameter(1, consecutivoTipoDelito);

            listaConductas = q.getResultList();

            if(listaConductas.size() > 0){
                code = 0L;
                mensaje = "se encontró información";
            }else{
                code = 2L;
                mensaje = "No se encontró información";
            }

            return ResponseEntity.ok(new PrConductasResponse(listaConductas, code, mensaje, null));

        } catch (Exception e) {
            return ResponseEntity.ok("falló consultar conducta por id");
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public ResponseEntity<?> obtenerConductasPorProcedimiento(Long consecutivoProcedimiento){
        List<PrConductas> listaConductas = new ArrayList<>();

        Long code = null;
        String mensaje;
        Query q = null;

        try {
            //String query = "SELECT * FROM PR_CONDUCTAS WHERE CONS_PROCEDIMIENTO = ?";
            String query = "SELECT PRC.CONSECUTIVO, PRC.CONS_TIPO_DELITO, PRC.CONS_DELITO, (SELECT ADM.DESCRIPCION FROM ADM_LISTA_CONDUCTAS ADM WHERE PRC.CONS_DELITO=ADM.CONSECUTIVO) descdelito, (SELECT ADM.DESCRIPCION FROM ADM_LISTA_CONDUCTAS ADM WHERE PRC.CONS_TIPO_DELITO=ADM.CONSECUTIVO) descconducta  FROM PR_CONDUCTAS PRC WHERE PRC.CONS_PROCEDIMIENTO = ?";

            q = em.createNativeQuery(query);

            q.setParameter(1, consecutivoProcedimiento);

            listaConductas = q.getResultList();

            if(listaConductas.size() > 0){
                code = 0L;
                mensaje = "se encontró información";
            }else {
                code = 2L;
                mensaje = "No se encontró información";
            }

            return ResponseEntity.ok(new PrConductasResponse(listaConductas, code, mensaje, consecutivoProcedimiento));

        } catch (Exception e) {
            return ResponseEntity.ok("falló consultar conducta por procedimiento");
        }
    }

}
`;

  document.getElementById("output").textContent = generatedCode;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
