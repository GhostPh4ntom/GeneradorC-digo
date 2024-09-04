function generarCodigoContoller() {
    const nombreProcedimiento = document.getElementById('nombreProcedimiento').value.trim();
    const nombreEsquema = document.getElementById('nombreEsquema').value.trim();
    const tableName = document.getElementById('tableName').value.trim();
    const tableComment = document.getElementById('tableComment').value.trim();
    const columnas = document.getElementById('columns').value.trim();

    const columnasArray = columnas.split(';').map(col => col.trim()).filter(col => col.length > 0);
    
    const nombreEntidad = tableName.replace(/^PR_/, 'Pr').replace(/_/g, '');

    let codigo = `// back\\src\\main\\java\\co\\gov\\policia\\pwa\\controller\\${nombreEntidad}Controller.java

package co.gov.policia.pwa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.gov.policia.pwa.service.${nombreEntidad}Service;

import org.springframework.web.bind.annotation.RequestBody;
import co.gov.policia.pwa.entity.${nombreEntidad};

@CrossOrigin("*")
@RestController
@RequestMapping("/v1/api/${nombreEntidad.toLowerCase()}")

//MODIFIQUE EL SIGUIENTE CÓDIGO DE ACUERDO A LA NECESIDAD
public class ${nombreEntidad}Controller {

    @Autowired
    ${nombreEntidad}Service ${nombreEntidad.toLowerCase()}Service;    

    @PostMapping(value = "/crear${nombreEntidad}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XHTML_XML_VALUE})
    public ResponseEntity<?> crear${nombreEntidad}(@RequestBody ${nombreEntidad} ${nombreEntidad.toLowerCase()}){                
        return ${nombreEntidad.toLowerCase()}Service.crear${nombreEntidad}(${nombreEntidad.toLowerCase()});
    }

    @GetMapping(value = "/obtener${nombreEntidad}PorId", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> obtener${nombreEntidad}PorId(@RequestParam Long id${nombreEntidad}) {
        return ${nombreEntidad.toLowerCase()}Service.obtener${nombreEntidad}PorId(id${nombreEntidad});
    }

    ${columnasArray.some(col => col.startsWith('CONS')) ? `
    @GetMapping(value = "/obtener${nombreEntidad}PorIdDelito", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> obtener${nombreEntidad}PorIdDelito(@RequestParam Long consecutivoDelito) {
        return ${nombreEntidad.toLowerCase()}Service.obtener${nombreEntidad}PorIdDelito(consecutivoDelito);
    }

    @GetMapping(value = "/obtener${nombreEntidad}PorProcedimiento", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> obtener${nombreEntidad}PorProcedimiento(@RequestParam Long consecutivoProcedimiento) {
        return ${nombreEntidad.toLowerCase()}Service.obtener${nombreEntidad}PorProcedimiento(consecutivoProcedimiento);
    }` : ''}

    @PostMapping(value = "/eliminar${nombreEntidad}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XHTML_XML_VALUE})
    public ResponseEntity<?> eliminar${nombreEntidad}(@RequestBody ${nombreEntidad} ${nombreEntidad.toLowerCase()}){                
        return ${nombreEntidad.toLowerCase()}Service.eliminar${nombreEntidad}(${nombreEntidad.toLowerCase()});
    }

}
`;
    document.getElementById('output').textContent = codigo;
}
