function generarCodigoEntity() {
    alert("ingreso a entity");
    const nombreProcedimiento = document.getElementById("nombreProcedimiento").value;
    const nombreEsquema = document.getElementById("nombreEsquema").value;
    const tableName = document.getElementById("tableName").value;
    const columnsText = document.getElementById("columns").value;

    // Procesar las columnas
    const columnas = columnsText.trim().split(";");
    let fields = "";
    let imports = "";

    columnas.forEach(columna => {
        const parts = columna.split(",");
        const nombre = parts[0].trim();
        const tipo = parts[1].trim();
        const tamaño = parts[2].trim();
        const nullable = parts[3].trim().toLowerCase() !== "not null";
        const comentario = parts[4] ? parts[4].trim() : "";

        let tipoJava;
        switch (tipo) {
            case "NUMBER":
                tipoJava = tamaño ? "BigDecimal" : "Long";
                if (!imports.includes("import java.math.BigDecimal;") && tipoJava === "BigDecimal") {
                    imports += "import java.math.BigDecimal;\n";
                }
                break;
            case "VARCHAR2":
                tipoJava = "String";
                break;
            case "DATE":
                tipoJava = "Date";
                if (!imports.includes("import java.util.Date;")) {
                    imports += "import java.util.Date;\n";
                }
                if (!imports.includes("import com.fasterxml.jackson.annotation.JsonFormat;")) {
                    imports += "import com.fasterxml.jackson.annotation.JsonFormat;\n";
                }
                break;
            default:
                tipoJava = "String"; // Default type
        }

        fields += `
    @Column(name = "${nombre}"${nullable ? "" : ", nullable = false"})
    ${tipoJava === "Date" ? `@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy", timezone = "America/Bogota", locale = "es_CO")\n    ` : ""}private ${tipoJava} ${nombre.toLowerCase()};\n`;
    });

    const entityCode = `
// back\\src\\main\\java\\co\\gov\\policia\\pwa\\entity\\${nombreProcedimiento}.java

package co.gov.policia.pwa.entity;

${imports}
import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Cacheable(false)
@Table(schema = "${nombreEsquema}", name = "${tableName}")
public class ${nombreProcedimiento} {

    @Id
    @Column(name = "CONSECUTIVO", nullable = false)
    private Long consecutivo;${fields}
}
`;

    document.getElementById("output").textContent = entityCode;
}
