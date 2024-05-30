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
    // 1.~~~~TODO:可以从这里修改识别范围~~~~
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
    // 3.将H3和H4的索引增加
    let currentH3ele = {
        initChapter: "",
        index: 0,
        title: "",
        ident: "",
        isIn: false
    }
    let currentH4ele = {
        initChapter: "",
        index: 0,
        title: "",
        ident: ""
    }
    let adpterIndex = 0

    allArray.forEach((element) => {
        // 2.1.找到h2ObjArray的位置
        if (h2ObjArray[h2Index] && element === h2ObjArray[h2Index].dom) {
            h2Index += 1
            currentH3ele.index = 0
            locker = true
        } else if (element.tagName === "H1" || element.tagName === "H2") {
            locker = false
        } else if (locker && element.tagName !== "H2") {
            // 就是从H3开始需求的
            if (element.tagName === "H3") {
                // 按顺序解析到H3
                currentH3ele.index += 1
                currentH4ele.index = 0
                const splitString = element.innerText.split(/[（()）]/)
                currentH3ele.title = splitString[0]
                currentH3ele.ident = splitString[1] ? splitString[1] : ""
                currentH3ele.initChapter = h2ObjArray[h2Index - 1].chapter + "." + currentH3ele.index
                // 将isIn变为true，说明当前解析在这里面
                currentH3ele.isIn = true
                // 段落索引设置0
                adpterIndex = 0
            } else if (element.tagName === "H4") {
                // 按顺序解析到H4
                currentH4ele.index += 1
                const splitString = element.innerText.split(/[（()）]/)
                currentH4ele.title = splitString[0]
                currentH4ele.ident = splitString[1] ? splitString[1] : ""
                // 将H3的isIn变为false，说明在H4里面不在H3了
                currentH3ele.isIn = false
                // chapter
                currentH4ele.initChapter = currentH3ele.initChapter + "." + currentH4ele.index
                // 段落索引
                adpterIndex = 0
            } else {
                // 当currentH3ele的title有值的时候开始解析
                if (currentH3ele.title) {
                    const demandObj = {
                        chapter: "",
                        title: "",
                        ident: "",
                        demandType: "",
                        content: ""
                    }
                    if (currentH3ele.isIn) {
                        demandObj.chapter = currentH3ele.initChapter
                        demandObj.title = currentH3ele.title
                        demandObj.ident = currentH3ele.ident
                        demandObj.demandType = demandObj.title.includes("接口") ? "3" : "1"
                    } else {
                        demandObj.chapter = currentH4ele.initChapter
                        demandObj.title = currentH4ele.title
                        demandObj.ident = currentH4ele.ident
                        demandObj.demandType = demandObj.title.includes("接口") ? "3" : "1"
                    }
                    // 1.解析table元素
                    if (element.tagName === "TABLE") {
                        demandObj.content = element.outerHTML
                        adpterIndex += 1
                        demandObj.ident = demandObj.ident + `-t${adpterIndex}`
                        demandArray.push(demandObj)
                    }
                    // 2.解析p元素-注意排除图片元素
                    if (element.tagName === "P" && !element.querySelector("img")) {
                        demandObj.content = element.innerText
                        adpterIndex += 1
                        demandObj.ident = demandObj.ident + `-p${adpterIndex}`
                        demandArray.push(demandObj)
                    }
                    // 3.解析ol和ul元素
                    if (element.tagName === "OL" || element.tagName === "UL") {
                        demandObj.content = element.innerHTML
                        adpterIndex += 1
                        demandObj.ident = demandObj.ident + `-u${adpterIndex}`
                        demandArray.push(demandObj)
                    }
                }
            }
        }
    })
    return demandArray
}
