// 根据后端定义，不能更改的枚举
enum DemandType {
    gn = "1",
    xn = "2",
    jk = "3",
    kkx = "4",
    aqx = "5",
    other = "6"
}

// 数据每一项的结构
interface DemandObj {
    chapter: string
    title: string
    ident?: string // 如果其标题有（）则放入
    demandType: DemandType
    content: string
}

// 定义h元素对象接口
interface IHobj {
    level: number // h1 -> 1
    title: string // 标题文字
    ident?: string // 如果有（）则放入
    index: number // 该标题的索引，先map的时候不设置后续再排列
    demandType: DemandType
}

// h元素对象带计算出的章节号的对象
interface IHobjWithChapter extends IHobj {
    chapter: string
}

export class HtmlParser {
    domArray: Element[] // 初始化得到一个元素的集合
    hWithChapter: IHobjWithChapter[]
    constructor(htmlText: string) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlText, "text/html")
        this.domArray = Array.from(doc.body.children)
        // 解析domArray将h元素加入
        const HDomArray = this.domArray.filter((domItem) => domItem.tagName.startsWith("H"))
        const storeArray: IHobj[] = []
        HDomArray.forEach((it, i) => {
            !it.textContent && (it.textContent = "")
            // 这里判断是什么类型的设计需求 -> 后续可以添加
            let type: DemandType = DemandType.gn
            if (it.textContent.includes("接口")) {
                type = DemandType.jk
            } else if (it.textContent.includes("性能")) {
                type = DemandType.xn
            } else if (it.textContent.includes("可靠")) {
                type = DemandType.kkx
            } else if (it.textContent.includes("安全")) {
                type = DemandType.aqx
            }
            // 获取章节号
            const level = +it.tagName.slice(1)
            // 1.判断当前的章节级别的前一个级别的level是否一样/小于/大于
            let index = 0
            if (i > 0) {
                // 找上一个标题对象的level
                if (level === storeArray[i - 1].level) {
                    index = storeArray[i - 1].index + 1
                } else if (level < storeArray[i - 1].level) {
                    // 如果等级小于上一个标题对象,找storeArray里面level一样的长度
                    for (let j = storeArray.length - 1; j >= 0; j--) {
                        if (storeArray[j].level === level) {
                            index = storeArray[j].index + 1
                            break
                        }
                    }
                }
            }
            storeArray.push({
                level: level,
                title: it.textContent,
                ident: it.textContent.match(/[\(（](.*?)[\)）]/)?.[1],
                index: index,
                demandType: type
            })
        })
        // 直接将storeArray计算出章节号
        const chapterArray: any[] = storeArray.map((it, indx) => {
            let str = it.index + 1 + ""
            for (let i = it.level - 1; i > 0; i--) {
                for (let j = indx - 1; j >= 0; j--) {
                    if (storeArray[j].level === i) {
                        str = storeArray[j].index + 1 + "." + str
                        break
                    }
                }
            }
            return {
                ...it,
                chapter: str
            }
        })
        this.hWithChapter = chapterArray
    }
    /**
     * 将所有Element元素遍历,输出列表格式
     */
    parseToArray(): DemandObj[] {
        const resArr: DemandObj[] = []
        let index = 0
        let currentHElement: IHobjWithChapter = this.hWithChapter[index]
        let adapterIndex: number = 1
        this.domArray.forEach((item) => {
            // 1.如果循环到H元素，将其存入
            if (item.tagName.startsWith("H")) {
                const text = item.textContent
                if (text !== currentHElement.title) {
                    currentHElement = this.hWithChapter[index + 1]
                    index++
                    adapterIndex = 1
                }
            } else {
                // 2.构造每一项放入 - chapter和content计算
                let content = ""
                let ident = currentHElement.ident
                if (!ident) {
                    ident = ""
                }
                // 这里对图片进行处理
                if (item.querySelector("img")) {
                    const img = item.querySelector("img")
                    if (img) {
                        const strblob = img.src + ""
                        const blob = strblob.split(",")[1]
                        content = `<img src="data:image/png;base64,${blob}" />`
                    }
                    ident += `-g${adapterIndex}`
                    adapterIndex++
                    resArr.push({
                        chapter: currentHElement.chapter,
                        title: currentHElement.title,
                        ident: ident,
                        demandType: currentHElement.demandType,
                        content
                    })
                } else {
                    // 如果不是图片进行判断
                    if (item.textContent) {
                        if (item.tagName === "TABLE") {
                            content = item.outerHTML
                            ident += `-t${adapterIndex}`
                            adapterIndex++
                        }
                        if (item.tagName === "P" && !item.querySelector("img")) {
                            content = item.innerHTML.trim()
                            ident += `-p${adapterIndex}`
                            adapterIndex++
                        }
                        if (item.tagName === "OL" || item.tagName === "UL") {
                            content = item.innerHTML.trim()
                            ident += `-u${adapterIndex}`
                            adapterIndex++
                        }
                        // title要将括号去除
                        resArr.push({
                            chapter: currentHElement.chapter,
                            title: currentHElement.title,
                            ident: ident,
                            demandType: currentHElement.demandType,
                            content
                        })
                    }
                }
            }
        })
        return resArr
    }
}
