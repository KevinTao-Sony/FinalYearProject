export default function returnBuffer(file) {
        
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onloadend = () => {
            // Do whatever you want with the file contents
            return Buffer(reader.result)
        }
    }
    