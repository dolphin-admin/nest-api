import { UAParser } from 'ua-parser-js'

export class UserAgentUtil {
  static parseUserAgent(userAgent?: string) {
    const uaParser = new UAParser(userAgent)
    return {
      userAgent: uaParser.getUA(),
      browser: this.parseBrowser(uaParser.getBrowser()),
      os: this.parseOS(uaParser.getOS()),
      device: this.parseDevice(uaParser.getDevice()),
      engine: this.parseEngine(uaParser.getEngine()),
      cpu: this.parseCPU(uaParser.getCPU())
    }
  }

  static parseBrowser(browser?: UAParser.IBrowser) {
    const { name, version, major } = browser || {}
    let result = ''
    if (name) {
      result += name
    }
    if (version) {
      result += ` ${version}`
    }
    if (major) {
      result += ` ${major}`
    }
    return result
  }

  static parseOS(os?: UAParser.IOS) {
    const { name, version } = os || {}
    let result = ''
    if (name) {
      result += name
    }
    if (version) {
      result += ` ${version}`
    }
    return result
  }

  static parseDevice(device?: UAParser.IDevice) {
    const { type, vendor, model } = device || {}
    let result = ''
    if (type) {
      result += type
    }
    if (vendor) {
      result += ` ${vendor}`
    }
    if (model) {
      result += ` ${model}`
    }
    return result
  }

  static parseEngine(engine?: UAParser.IEngine) {
    const { name, version } = engine || {}
    let result = ''
    if (name) {
      result += name
    }
    if (version) {
      result += ` ${version}`
    }
    return result
  }

  static parseCPU(cpu?: UAParser.ICPU) {
    const { architecture } = cpu || {}
    let result = ''
    if (architecture) {
      result += architecture
    }
    return result
  }
}
