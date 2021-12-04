package cn.jisol.ngame.rpc.mode;

/**
 * RPC 底层传输模式
 */
public enum NRPCMode {
    DEFAULT, // 默认模式 通过 类名和方法名找到合适的方法
    UID,// UID模式 通过 ID找到相同ID的方法
}
