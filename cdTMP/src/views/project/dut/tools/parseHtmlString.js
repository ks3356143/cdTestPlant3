/**
 * 辅助函数，给每个h2增加个自定义属性，用来储存章节号，返回功能/接口h2节点对象【非DOM，有dom属性表示DOM】
 */
function getNeedH2NodeList(h1h2Node) {
    const h2ObjList = []
    // 首先将h1和h2节点都组成一个数组
    let h1Index = 0,
        h2Index = 0
    h1h2Node.forEach((hDom) => {
        if (hDom.tagName === "H1") {
            // 找到h1，那么其index+1
            h1Index += 1
            h2Index = 0
        } else if (hDom.tagName === "H2") {
            // 按顺序找到h2了，
            h2Index += 1
            let h2Obj = {
                chapter: h1Index + "." + h2Index,
                dom: hDom,
                text: hDom.innerText
            }
            h2ObjList.push(h2Obj)
        }
    })
    // 1.后续增加识别的章节可从这里修改
    return h2ObjList.filter(
        (item) =>
            item.text.includes("CSCI功能需求") ||
            item.text.includes("CSCI外部接口需求") ||
            item.text.includes("CSCI能力需求")
    )
}

/**
 * 思路：因为mammoth解析后变为html字符串，使用new DOMParser()转换为DOM进行解析
 * 作用：创建DOMParser()对象，然后解析需求规格说明的html字符串，目前仅支持功能和接口需求
 * 返回：Array[Object[String,String]]
 */
export function parseHtmlStringByDemandDut(htmlString) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, "text/html")
    const h1h2NodeList = doc.querySelectorAll("h1,h2")
    // 这一步得到功能需求、接口需求的h2对象，里面有dom、text、chapter
    const h2ObjArray = getNeedH2NodeList(h1h2NodeList)
    // 这里开始就要获取全部有用信息：
    // 2.遍历全部DOM
    const allArray = Array.from(doc.body.children)
    const demandArray = []
    let h2Index = 0
    let locker = false
    allArray.forEach((element) => {
        // 2.1.找到h2ObjArray的位置
        if (h2ObjArray[h2Index] && element === h2ObjArray[h2Index].dom) {
            h2Index += 1
            locker = true
        } else if (element.tagName === "H1" || element.tagName === "H2") {
            locker = false
        } else if (locker && element.tagName !== "H2") {
            console.log(element)
            // 这里就是有效信息了，注意还要找H3/H4等信息 - 然后通过h2的索引也可以知道章节号
        }
    })
}
