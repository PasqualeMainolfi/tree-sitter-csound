import XCTest
import SwiftTreeSitter
import TreeSitterCsound

final class TreeSitterCsoundTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_csound())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Tree-sitter Csound grammar")
    }
}
