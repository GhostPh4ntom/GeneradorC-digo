function generateSQL() {
    const tableName = document.getElementById('tableName').value.trim();
    const tableComment = document.getElementById('tableComment').value.trim();
    const columnsInput = document.getElementById('columns').value.trim();
    const columns = columnsInput.split(';').map(c => c.trim()).filter(c => c.length > 0);
    
    let createTableSQL = `-- Creación de la tabla.\nCREATE TABLE ${tableName} (\n`;
    let commentsSQL = `-- Creación de los comentarios en columnas.\n`;
    
    columns.forEach((col, index) => {
        const [colName, colType, colSize, nullable, colComment] = col.split(',').map(c => c.trim());
        const colDef = `${colName.toUpperCase()} ${colType.toUpperCase()}${colSize ? ` ${colSize}` : ''} ${nullable === 'NOT NULL' ? 'NOT NULL' : ''}`;
        
        createTableSQL += `  ${colDef}${index < columns.length - 1 ? ',' : ''}\n`;
        commentsSQL += `COMMENT ON COLUMN ${tableName}.${colName.toUpperCase()} IS '${colComment.trim()}';\n`;
    });
    
    createTableSQL += `) TABLESPACE DATOS PCTFREE 10 INITRANS 1 MAXTRANS 255 STORAGE (\n  INITIAL 128K NEXT 128K MINEXTENTS 1 MAXEXTENTS UNLIMITED\n);\n`;
    
    const tableCommentSQL = `-- Creación del comentario en la tabla.\nCOMMENT ON TABLE ${tableName} IS '${tableComment}';\n`;
    
    let packageSQL = `-- Creación del paquete PK_${tableName}.\nCREATE OR REPLACE PACKAGE PK_${tableName} AS\nPROCEDURE PR_INSERT_${tableName}(\n`;
    let packageBodySQL = `-- Cuerpo del paquete PK_${tableName}.\nCREATE OR REPLACE PACKAGE BODY PK_${tableName} AS\nPROCEDURE PR_INSERT_${tableName}(\n`;

    columns.forEach((col, index) => {
        const [colName] = col.split(',').map(c => c.trim());
        if (colName.toUpperCase() !== 'CONSECUTIVO') {
            packageSQL += `  i_${colName.toUpperCase()} IN ${tableName}.${colName.toUpperCase()}%TYPE${index < columns.length - 1 ? ',' : ''}\n`;
            packageBodySQL += `  i_${colName.toUpperCase()} IN ${tableName}.${colName.toUpperCase()}%TYPE${index < columns.length - 1 ? ',' : ''}\n`;
        }
    });

    packageSQL += `,\n  O_CONSECUTIVO OUT NUMBER,\n  O_RESPUESTA OUT NUMBER,\n  O_DESC_RESULTADO OUT VARCHAR2\n);\nEND PK_${tableName};\n`;
    
    packageBodySQL += `,\n  O_CONSECUTIVO OUT NUMBER,\n  O_RESPUESTA OUT NUMBER,\n  O_DESC_RESULTADO OUT VARCHAR2\n) AS\n  i_secuencia NUMBER;\nBEGIN\n`;
    packageBodySQL += `  SELECT ${tableName}_SEQ.NEXTVAL INTO i_secuencia FROM dual;\n`;
    packageBodySQL += `  INSERT INTO ${tableName} (\n    CONSECUTIVO, \n`;

    columns.forEach((col, index) => {
        const [colName] = col.split(',').map(c => c.trim());
        if (colName.toUpperCase() !== 'CONSECUTIVO') {
            packageBodySQL += `    ${colName.toUpperCase()}${index < columns.length - 1 ? ',' : ''}\n`;
        }
    });

    packageBodySQL += `  ) VALUES (\n    i_secuencia, \n`;
    
    columns.forEach((col, index) => {
        const [colName] = col.split(',').map(c => c.trim());
        if (colName.toUpperCase() !== 'CONSECUTIVO') {
            packageBodySQL += `    i_${colName.toUpperCase()}${index < columns.length - 1 ? ',' : ''}\n`;
        }
    });

    packageBodySQL += `  );\n  O_RESPUESTA := 0;\n  O_DESC_RESULTADO := 'Inserción exitosa';\n  O_CONSECUTIVO := i_secuencia;\n  COMMIT;\n`;
    packageBodySQL += `EXCEPTION\n  WHEN OTHERS THEN\n    O_RESPUESTA := 1;\n    O_DESC_RESULTADO := 'Error en inserción: ' || SQLERRM;\n    O_CONSECUTIVO := i_secuencia;\nEND PR_INSERT_${tableName};\nEND PK_${tableName};\n`;

    let synonymSQL = `-- Creación del sinónimo en tabla y paquete.\nCREATE PUBLIC SYNONYM PK_${tableName} FOR USR_PROC.PK_${tableName};\n`;

    let grantSQL = `-- Creación de los permisos.\nGRANT SELECT, INSERT ON ${tableName} TO USR_PWA;\n`;

    let grantSQLExecute = `-- Creación de los permisos.\nGRANT EXECUTE ON PK_${tableName} TO USR_PWA;\n`;

    const sequenceSQL = `-- Creación de la secuencia.\nCREATE SEQUENCE ${tableName}_SEQ MINVALUE 1 MAXVALUE 9999999999999999999999999999 START WITH 1 INCREMENT BY 1 NOCACHE;\n`;

    const finalSQL = `${createTableSQL}\n${tableCommentSQL}\n${commentsSQL}\n${sequenceSQL}\n${packageSQL}\n${packageBodySQL}\n${synonymSQL}\n${grantSQL}\n${grantSQLExecute}`;

    document.getElementById('output').innerText = finalSQL;
}

document.getElementById('sqlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    generateSQL();
});

function generateSQL() {
    try {
        const tableName = document.getElementById('tableName').value.trim();
        const tableComment = document.getElementById('tableComment').value.trim();
        const columnsInput = document.getElementById('columns').value.trim();
        const columns = columnsInput.split(';').map(c => c.trim()).filter(c => c.length > 0);

        let createTableSQL = `-- Creación de la tabla.\nCREATE TABLE ${tableName} (\n`;
        let commentsSQL = `-- Creación de los comentarios en columnas.\n`;

        columns.forEach((col, index) => {
            const [colName, colType, colSize, nullable, colComment] = col.split(',').map(c => c.trim());
            const colDef = `${colName.toUpperCase()} ${colType.toUpperCase()}${colSize ? ` ${colSize}` : ''} ${nullable === 'NOT NULL' ? 'NOT NULL' : ''}`;

            createTableSQL += `  ${colDef}${index < columns.length - 1 ? ',' : ''}\n`;
            commentsSQL += `COMMENT ON COLUMN ${tableName}.${colName.toUpperCase()} IS '${colComment.trim()}';\n`;
        });

        createTableSQL += `) TABLESPACE DATOS PCTFREE 10 INITRANS 1 MAXTRANS 255 STORAGE (\n  INITIAL 128K NEXT 128K MINEXTENTS 1 MAXEXTENTS UNLIMITED\n);\n`;

        const tableCommentSQL = `-- Creación del comentario en la tabla.\nCOMMENT ON TABLE ${tableName} IS '${tableComment}';\n`;

        let packageSQL = `-- Creación del paquete PK_${tableName}.\nCREATE OR REPLACE PACKAGE PK_${tableName} AS\nPROCEDURE PR_INSERT_${tableName}(\n`;
        let packageBodySQL = `-- Cuerpo del paquete PK_${tableName}.\nCREATE OR REPLACE PACKAGE BODY PK_${tableName} AS\nPROCEDURE PR_INSERT_${tableName}(\n`;

        columns.forEach((col, index) => {
            const [colName] = col.split(',').map(c => c.trim());
            if (colName.toUpperCase() !== 'CONSECUTIVO') {
                packageSQL += `  i_${colName.toUpperCase()} IN ${tableName}.${colName.toUpperCase()}%TYPE${index < columns.length - 1 ? ',' : ''}\n`;
                packageBodySQL += `  i_${colName.toUpperCase()} IN ${tableName}.${colName.toUpperCase()}%TYPE${index < columns.length - 1 ? ',' : ''}\n`;
            }
        });

        packageSQL += `,\n  O_CONSECUTIVO OUT NUMBER,\n  O_RESPUESTA OUT NUMBER,\n  O_DESC_RESULTADO OUT VARCHAR2\n);\nEND PK_${tableName};\n`;

        packageBodySQL += `,\n  O_CONSECUTIVO OUT NUMBER,\n  O_RESPUESTA OUT NUMBER,\n  O_DESC_RESULTADO OUT VARCHAR2\n) AS\n  i_secuencia NUMBER;\nBEGIN\n`;
        packageBodySQL += `  SELECT ${tableName}_SEQ.NEXTVAL INTO i_secuencia FROM dual;\n`;
        packageBodySQL += `  INSERT INTO ${tableName} (\n    CONSECUTIVO, \n`;

        columns.forEach((col, index) => {
            const [colName] = col.split(',').map(c => c.trim());
            if (colName.toUpperCase() !== 'CONSECUTIVO') {
                packageBodySQL += `    ${colName.toUpperCase()}${index < columns.length - 1 ? ',' : ''}\n`;
            }
        });

        packageBodySQL += `  ) VALUES (\n    i_secuencia, \n`;

        columns.forEach((col, index) => {
            const [colName] = col.split(',').map(c => c.trim());
            if (colName.toUpperCase() !== 'CONSECUTIVO') {
                packageBodySQL += `    i_${colName.toUpperCase()}${index < columns.length - 1 ? ',' : ''}\n`;
            }
        });

        packageBodySQL += `  );\n  O_RESPUESTA := 0;\n  O_DESC_RESULTADO := 'Inserción exitosa';\n  O_CONSECUTIVO := i_secuencia;\n  COMMIT;\n`;
        packageBodySQL += `EXCEPTION\n  WHEN OTHERS THEN\n    O_RESPUESTA := 1;\n    O_DESC_RESULTADO := 'Error en inserción: ' || SQLERRM;\n    O_CONSECUTIVO := i_secuencia;\nEND PR_INSERT_${tableName};\nEND PK_${tableName};\n`;

        let synonymSQL = `-- Creación del sinónimo en tabla y paquete.\nCREATE PUBLIC SYNONYM PK_${tableName} FOR USR_PROC.PK_${tableName};\n`;

        let grantSQL = `-- Creación de los permisos.\nGRANT SELECT, INSERT ON ${tableName} TO USR_PWA;\n`;

        let grantSQLExecute = `-- Creación de los permisos.\nGRANT EXECUTE ON PK_${tableName} TO USR_PWA;\n`;

        const sequenceSQL = `-- Creación de la secuencia.\nCREATE SEQUENCE ${tableName}_SEQ MINVALUE 1 MAXVALUE 9999999999999999999999999999 START WITH 1 INCREMENT BY 1 NOCACHE;\n`;

        const finalSQL = `${createTableSQL}\n${tableCommentSQL}\n${commentsSQL}\n${sequenceSQL}\n${packageSQL}\n${packageBodySQL}\n${synonymSQL}\n${grantSQL}\n${grantSQLExecute}`;

        document.getElementById('output').innerText = finalSQL;
    } catch (error) {
        console.error("Error al generar el código SQL: ", error);
        document.getElementById('output').innerText = `Error al generar el código SQL, Verifique los datos ingresados en la definición de columnas, Error: ${error.message}`;
    }
}
