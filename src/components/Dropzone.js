import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'


export default function Dropzone() {

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)
            }
            reader.readAsText(file)
        })

    }, [])
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop });

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
    </li>
    ));


    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </div>
    )
}
