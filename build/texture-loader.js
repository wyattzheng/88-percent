const path = require("path");
const fs = require("fs");

const FileHound = require("filehound");
const jsStringEscape = require("js-string-escape");

const ConstDependency = require("webpack/lib/dependencies/ConstDependency");
const { toConstantDependency } = require("webpack/lib/javascript/JavascriptParserHelpers");

const ReplacedExpression = "process.env.TEXTURE_LIST";
const PluginName = "TextureLoaderPlugin";

const PNG_MODULE_SUFFIX = ".png";
const JSON_MODULE_SUFFIX = ".json";

function buildTextureList(contextPath, rootPath, rootDir) {
	const fullPathRoot = path.resolve(contextPath, rootDir);

	const moduleFiles = FileHound.create().path(fullPathRoot).addFilter((file) => {
		return file.getName().endsWith(PNG_MODULE_SUFFIX) || file.getName().endsWith(JSON_MODULE_SUFFIX);
	}).findSync();

	const modules = [];
	for(const filePath of moduleFiles){
		const contextRelPath = path.relative(fullPathRoot, filePath);
		const url = path.join(rootPath, contextRelPath).split(path.sep).join("/");

		const fileBuffer = fs.readFileSync(filePath);
		if(filePath.endsWith(JSON_MODULE_SUFFIX)){
			modules.push(JSON.parse(fileBuffer.toString()));
		}else if(filePath.endsWith(PNG_MODULE_SUFFIX)){
			const name = path.basename(contextRelPath, PNG_MODULE_SUFFIX);
			const dirname = path.dirname(contextRelPath);
			const baseKey = dirname === '.' ? '' : dirname.split(path.sep).join(".");

			const textureItem = {
				url,
				key: baseKey ? (baseKey + "." + name) : name
			}
			
			modules.push(textureItem);
		}
	}

	return modules;
}

class TextureLoaderPlugin{
	constructor(options) {
		this.options = options;
		if(!this.options.rootDir) {
			throw new Error("rootDir must be provided");
		}
		if(!fs.existsSync(this.options.rootDir)){
			throw new Error("rootDir must exist.");
		}
	}

	apply(compiler) {

		compiler.hooks.compilation.tap(PluginName, (compilation, { normalModuleFactory }) => {

			const moduleList = buildTextureList(compiler.context, this.options.rootPath, this.options.rootDir)
			const string = JSON.stringify(moduleList);
			const code = `'${jsStringEscape(string)}'`;
	
			compilation.dependencyTemplates.set(
				ConstDependency,
				new ConstDependency.Template()
			);

			const handler = (parser) => {
				parser.hooks.expression
				.for(ReplacedExpression)
				.tap(PluginName, (expr) => {
					return toConstantDependency(parser, code)(expr);
				});
			};
			
			const factoryParser = normalModuleFactory.hooks.parser;
			factoryParser.for("javascript/auto").tap(PluginName, handler);
			factoryParser.for("javascript/dynamic").tap(PluginName, handler);

		});
	}
}
module.exports = TextureLoaderPlugin;
