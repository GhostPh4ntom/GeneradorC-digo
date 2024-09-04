function generarCodigoEntity() {
    const nombreProcedimiento = document.getElementById("nombreProcedimiento").value.trim();
    const nombreEsquema = document.getElementById("nombreEsquema").value.trim();
    const tableName = document.getElementById("tableName").value.trim();
    const tableComment = document.getElementById("tableComment").value.trim();
    const columns = document.getElementById("columns").value.trim().split(";").filter(col => col.trim() !== "");

    let codigo = `// back\\src\\main\\java\\co\\gov\\policia\\pwa\\entity\\${nombreProcedimiento}.java\n\n`;

    codigo += `package co.gov.policia.pwa.entity;\n\n`;
    codigo += `import java.util.Date;\n\n`;
    codigo += `import javax.persistence.Cacheable;\n`;
    codigo += `import javax.persistence.Column;\n`;
    codigo += `import javax.persistence.Entity;\n`;
    codigo += `import javax.persistence.Id;\n`;
    codigo += `import javax.persistence.Table;\n\n`;
    codigo += `import com.fasterxml.jackson.annotation.JsonFormat;\n\n`;
    codigo += `import lombok.AllArgsConstructor;\n`;
    codigo += `import lombok.Builder;\n`;
    codigo += `import lombok.Data;\n`;
    codigo += `import lombok.NoArgsConstructor;\n\n`;
    codigo += `@Entity\n`;
    codigo += `@Data\n`;
    codigo += `@AllArgsConstructor\n`;
    codigo += `@NoArgsConstructor\n`;
    codigo += `@Builder\n`;
    codigo += `@Cacheable(false)\n`;
    codigo += `@Table(schema = "${nombreEsquema}", name = "${tableName}")\n`;
    codigo += `public class ${nombreProcedimiento} {\n`;

    columns.forEach(column => {
        const [name, type, size, nullable, comment] = column.split(",").map(item => item.trim());

        const columnType = (type === "NUMBER") ? "Long" : (type.startsWith("VARCHAR2") ? "String" : "Date");
        const columnNullable = nullable.includes("NOT NULL") ? "false" : "true";

        if (name === "CONSECUTIVO") {
            codigo += `    @Id\n`;
        }

        if (type === "DATE") {
            codigo += `    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy", timezone = "America/Bogota", locale = "es_CO")\n`;
        }

        codigo += `    @Column(name = "${name}", nullable = ${columnNullable})\n`;
        codigo += `    private ${columnType} ${name.toLowerCase()};\n\n`;
    });

    codigo += `}\n`;

    document.getElementById("output").textContent = codigo;
}
