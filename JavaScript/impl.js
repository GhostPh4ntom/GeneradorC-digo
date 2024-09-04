function generarCodigoImpl() {
    // Obtén los valores ingresados por el usuario
    const nombreProcedimiento = document.getElementById("nombreProcedimiento").value.trim();
    const nombreEsquema = document.getElementById("nombreEsquema").value.trim();
    const nombreTabla = document.getElementById("tableName").value.trim();
    const comentarioTabla = document.getElementById("tableComment").value.trim();
    const columnasTexto = document.getElementById("columns").value.trim();

    // Validación de campos obligatorios
    if (!nombreProcedimiento || !nombreEsquema || !nombreTabla || !comentarioTabla || !columnasTexto) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Procesar las columnas
    const columnas = columnasTexto.split(';').map(col => col.trim()).filter(col => col);

    let parametrosIN = '';
    let parametrosSet = '';

    columnas.forEach((col) => {
        const [nombreColumna, tipo, , nullable] = col.split(',').map(item => item.trim());
        
        if (nombreColumna && tipo) {
            // Generar los parámetros de entrada
            parametrosIN += `storedProcedureQuery.registerStoredProcedureParameter("i_${nombreColumna}", ${tipo === 'VARCHAR2' ? 'String' : tipo === 'NUMBER' ? 'Long' : 'Date'}.class, ParameterMode.IN);\n`;

            // Generar los valores set
            parametrosSet += `storedProcedureQuery.setParameter("i_${nombreColumna}", conducta.get${nombreColumna.charAt(0).toUpperCase() + nombreColumna.slice(1).toLowerCase()}());\n`;
        }
    });

    // Estructura básica del código
    const codigoImpl = `
// back\\src\\main\\java\\co\\gov\\policia\\pwa\\service\\impl\\${nombreProcedimiento}ServiceImpl.java

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
public class ${nombreProcedimiento}ServiceImpl extends AbstractService implements ${nombreProcedimiento}Service {
    
    @Lazy
    @Autowired
    ${nombreProcedimiento}Service ${nombreProcedimiento.charAt(0).toLowerCase() + nombreProcedimiento.slice(1)}Service;

    @Override
    @Transactional
    public ResponseEntity<?> crear${nombreProcedimiento}(${nombreProcedimiento} conducta){

        String procedimiento = "PK_${nombreTabla}.PR_INSERT_${nombreTabla}";

        StoredProcedureQuery storedProcedureQuery = em.createStoredProcedureQuery(procedimiento);

        ${parametrosIN}

        storedProcedureQuery.registerStoredProcedureParameter("o_CONSECUTIVO", Long.class, ParameterMode.OUT);
        storedProcedureQuery.registerStoredProcedureParameter("o_RESPUESTA", Long.class, ParameterMode.OUT);
        storedProcedureQuery.registerStoredProcedureParameter("o_DESC_RESULTADO", String.class, ParameterMode.OUT);

        ${parametrosSet}
        
        storedProcedureQuery.execute();

        Long response = (Long) storedProcedureQuery.getOutputParameterValue("o_RESPUESTA");
        String responseDescription = (String) storedProcedureQuery.getOutputParameterValue("o_DESC_RESULTADO");
        long responseConsecutivo = (Long) storedProcedureQuery.getOutputParameterValue("o_CONSECUTIVO");

        return ResponseEntity.ok(new ${nombreProcedimiento}Response(null, response, responseDescription, responseConsecutivo));
    }

    // Código adicional para otros métodos como eliminar, obtener por id, etc.
    ...
}`;

    // Mostrar el código generado en el área de salida
    document.getElementById("output").textContent = codigoImpl;
}
