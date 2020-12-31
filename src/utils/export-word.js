export function export2Word(tempPath, form, exportName) {
  // 读取并获得模板文件的二进制内容
  JSZipUtils.getBinaryContent(tempPath, function(error, content) {
    // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
    // 抛出异常
    if (error) {
      throw error
    }

    // 创建一个JSZip实例，内容为模板的内容
    const zip = new JSZip(content)
    // 创建并加载docxtemplater实例对象
    const doc = new window.docxtemplater().loadZip(zip)
    // 设置模板变量的值
    // doc.setData({
    //   ...form,
    //   table: tableData,
    //   table1: tableData
    // })
    doc.setData(form)

    try {
      // 用模板变量的值替换所有模板变量
      doc.render()
    } catch (error) {
      // 抛出异常
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties
      }
      console.log(JSON.stringify({ error: e }))
      throw error
    }

    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
    // 将目标文件对象保存为目标类型的文件，并命名
    saveAs(out, exportName + '.docx')
  })
}
