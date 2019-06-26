import CrudService from './CrudService';
import * as rules from './rule-types';
import DynamodbBackend from './backends/dynamodb/Backend';
import MemoryBackend from './backends/memory/Backend';
import IBackend from './IBackend';
import Context from './Context';
import Options from './Options';
import RuleService from './RuleService';
import IExecutor from './IExecutor';
import DefaultExecutor from './DefaultExecutor';
import Rule from './Rule';
import JsonRuleExporter from './rule-exporters/JsonRuleExporter';
import StringRuleExporter from './rule-exporters/StringRuleExporter';
import Container from './Container';
import handler, { h } from './handler';

const container = new Container();

export {
    handler, h,
    Context,
    container, Container,
    CrudService, CrudService as default,
    IExecutor, DefaultExecutor,
    rules, Rule, Options, RuleService, JsonRuleExporter, StringRuleExporter,
    DynamodbBackend, MemoryBackend, IBackend,
};